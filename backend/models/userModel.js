import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isBlocked: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    isShipper: { type: Boolean, default: false, required: true },
    shipper: {
      logo: String,
    },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
    homeAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
      lat: Number,
      lng: Number,
    },
    warnings: [
      {
        reason: { type: String, required: true },
        description: { type: String, required: true },
        warnBy: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
