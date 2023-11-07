import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js";
import path from "path";


import { options } from "./config/options.js";
import { initializePassport } from "./config/passport.config.js";
import { authRouter } from "./routes/auth.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import "./config/dbConnection.js";


dotenv.config({ path: './process.env' });

const port = options.server.port;
const app = express();

//middleware
app.use(express.json());

app.listen(port,()=>console.log(`Server ok`));

//configuracion session
app.use(session({
    store: MongoStore.create({
        mongoUrl:options.mongoDB.url,
    }),
    secret:process.env.PRIVATE_KEY,
    resave:false,
    saveUninitialized:false
}));

//configuracion motor de plantillas
app.engine(".hbs",handlebars.engine({extname: '.hbs'}));
app.set('views',path.join(__dirname, "/views"));
app.set("view engine", ".hbs");

//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/sessions", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);