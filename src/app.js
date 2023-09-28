import express from "express";
import mongoose from "mongoose";
import handlebars from 'express-handlebars'
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";

import productsRouter from "../routes/products.router.js";
import cartRouter from "../routes/cart.router.js";
import router from "../routes/view.router.js";
import {AuthRouter} from "../routes/auth.routes.js"
import {WebRouter} from "../routes/web.routes.js"
import __dirname from './utils.js';


const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
  store:MongoStore.create({
      mongoUrl:"mongodb+srv://PatricioHCarames:Back1234@backende-commerce.8rpdxkg.mongodb.net/Products",
      ttl: 180,
  }),
  secret:"claveSecreta",
  resave:true,
  saveUninitialized:true
}))

//configuracion de handlebars
app.set("views", __dirname +"/views");
app.engine('handlebars', handlebars.engine());
app.set("view engine", "handlebars");


//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", AuthRouter)
app.use(WebRouter);

app.use("/", router);

mongoose.connect("mongodb+srv://PatricioHCarames:Back1234@backende-commerce.8rpdxkg.mongodb.net/Products", {
  useNewUrlParser: true,
  useUnifiedTopology:true,
}).then((conn)=>{console.log("connected to MongoDB")})


const server = app.listen(8080, () => {
  console.log('Server ON')
})

const io = new Server(server);

io.on("connection", (socket)=>{
  console.log(`usuario conectado @ ${socket.id}`)
  socket.emit("allProducts", productManager.getProducts());
})