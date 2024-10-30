import mongoose from "mongoose";

const cartItemsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: { type: Object, default: {} }
  },
  { minimize: false }
);

const CartItems =
  mongoose.model.CartItems || mongoose.model("CartItems", cartItemsSchema);
export default CartItems;
