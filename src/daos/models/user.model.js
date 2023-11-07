import bcrypt from "bcrypt";
import mongoose from "mongoose";

const SALT_ROUNDS = 10;

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required:true
    },
    last_name: {
        type:String,
        required:true
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    age: {
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type: String,
        required:true,
        enum:["usuario","admin"],
        default: 'usuario',
    }

    
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    } catch (error) {
        next(error);
    }
})

export const UserModel = mongoose.model(userCollection, userSchema);
