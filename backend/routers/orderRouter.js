import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  isShipperOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from "../utils.js";

const orderRouter = express.Router();
orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};

    const orders = await Order.find({ ...sellerFilter }).populate(
      "user",
      "name"
    );
    res.send(orders);
  })
);

orderRouter.get(
  "/not-delivered-orders",
  isAuth,
  isShipperOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ isDelivered: false }).populate(
      "user",
      "name"
    );
    res.send(orders);
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      const order = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/bid",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { shipperId, name, price } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      if (
        order.shipperBids.filter((bid) => bid.shipperId === shipperId).length
      ) {
        res.status(500).send({ message: "You already bid on this order" });
      }

      order.shipperBids = [
        ...order.shipperBids,
        {
          shipperId,
          shipperName: name,
          price,
        },
      ];
      const updatedOrder = await order.save();
      res.send({ message: "Bid Success", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/select-shipper",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { shipperId, price, justification } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.shipper = await User.findById(shipperId);
      order.shippingPrice = price;
      order.selectShipperJustification = justification;
      order.shippingStatus = "Shipping";

      const updatedOrder = await order.save();

      // warning handling
      for (let bid of order.shipperBids) {
        if (bid.price < price && !justification) {
          const seller = await User.findById(req.user._id);
          seller.warnings = [
            ...seller.warnings,
            {
              reason: "Bid Selection",
              description: `select high price bid without justification on order ${order._id}`,
            },
          ];
          if (seller.warnings.length >= 3) {
            seller.isBlocked = true;
          }
          await seller.save();
        }
      }

      res.send({ message: "Select Shipper Success", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/change-status",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.shippingStatus = status ? status : "Shipping";

      const updatedOrder = await order.save();
      res.send({ message: "Change Status Success", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: "Amazona <amazona@mg.yourdomain.com>",
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: "Order Deleted", order: deleteOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: "Order Delivered", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.post(
  "/:id/warning",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (order.complain) {
        res.status(500).send({ message: "You already complain this order" });
      }
      const { clerkWarning, shipperWarning } = req.body;
      if (clerkWarning) {
        const seller = await User.findById(order.user);

        seller.warnings = [
          ...seller.warnings,
          {
            reason: "Order",
            description: clerkWarning,
            warnBy: req.user._id,
          },
        ];

        order.complain = {
          ...order.complain,
          clerkWarning,
          warnBy: req.user._id,
        };
        if (seller.warnings.length >= 3) {
          seller.isBlocked = true;
        }
        const updatedSeller = await seller.save();
      }
      if (shipperWarning) {
        const shipper = await User.findById(order.shipper);
        shipper.warnings = [
          ...shipper.warnings,
          {
            reason: "Order",
            description: shipperWarning,
            warnBy: req.user._id,
          },
        ];

        order.complain = {
          ...order.complain,
          shipperWarning,
          warnBy: req.user._id,
        };
        if (shipper.warnings.length >= 3) {
          shipper.isBlocked = true;
        }
        const updatedShipper = await shipper.save();
      }
      const updatedOrder = await order.save();
      res.send({ message: "Success", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
