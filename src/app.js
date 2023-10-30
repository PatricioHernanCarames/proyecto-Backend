import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import "./config/dbConnection.js";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import { authRouter } from "./routes/auth.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import dotenv from 'dotenv';
import mongoose from "mongoose"

dotenv.config({ path: './process.env' });

const port = process.env.PORT;
const app = express();

//middleware
app.use(express.json());

app.listen(port,()=>console.log(`Server ok`));

//configuracion session
app.use(session({
    store: MongoStore.create({
        mongoUrl:process.env.DATABASE_URL
    }),
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false
}));

//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/sessions", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);