import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: String,
  },
  {
    timestamps: true,
  }
);
const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
