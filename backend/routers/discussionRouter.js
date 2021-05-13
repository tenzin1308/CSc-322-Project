import express from "express";
import expressAsyncHandler from "express-async-handler";
import Discussion from "../models/discissionModel.js";
import { isAuth } from "../utils.js";

const discussionRouter = express.Router();

discussionRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { message } = req.body;
    const discussion = new Discussion({
      sender: req.user._id,
      message,
    });
    const createdDiscussion = await discussion.save();
    res
      .status(201)
      .send({
        message: "New Message in Discussion",
        tabooWord: createdDiscussion,
      });
  })
);

discussionRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const discussion = await Discussion.find({}).populate("sender");
    res.send(discussion);
  })
);

export default discussionRouter;
