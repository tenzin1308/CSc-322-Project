import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrderMine } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function OrderHistoryScreen(props) {
  const orderMineList = useSelector((state) => state.orderMineList);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const { loading, error, orders } = orderMineList;
  const [bids, setBid] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderMine(userInfo.isShipper));
  }, [dispatch]);
  return (
    <div>
      <h1>
        {userInfo.isShipper ? "Available Orders for Biding" : "Order History"}
      </h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  {userInfo.isShipper ? (
                    <>
                      <input
                        type="number"
                        id="bid_price"
                        value={bids[i]?.price ?? 0}
                        style={{ width: 50, marginRight: 10 }}
                        onChange={(e) => {
                          const newBids = { ...bids };
                          if (!newBids[i]?.price) {
                            newBids[i] = { price: 0 };
                          }
                          newBids[i]["price"] = e.target.value;

                          setBid(newBids);
                        }}
                      />
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          // setBid({
                          //   id: order._id,
                          //   price:bids.price
                          // })
                        }}
                      >
                        Bid
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="small"
                      onClick={() => {
                        props.history.push(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
