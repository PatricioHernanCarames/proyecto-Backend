import mongoose from "mongoose";

const CartCollection = "carts";

const CartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"products"
      },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    required: true,
    default: [],
  },
});

CartSchema.pre("find", function () {
  this.populate("products.id");
});
export const CartModel = mongoose.model(CartCollection, CartSchema);
