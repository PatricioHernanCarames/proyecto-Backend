import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    products: [{
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
    }]
})

const Cart = mongoose.model("Cart", CartSchema)

export default Cart;