import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name :String ,
    email: String,
    age: Number,
    password: String,
})

export const UserModel = mongoose.model("User", userSchema);

