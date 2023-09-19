import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    item : String,
    description : String,
    price : Number,
    thumbnail : String,
    code : String,
    stock : Number,
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;



