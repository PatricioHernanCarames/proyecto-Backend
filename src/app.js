import express from "express";
import mongoose from "mongoose";
import { join } from "path";
import productsRouter from "../routes/products.router.js";
import cartRouter from "../routes/cart.router.js";
import router from "../routes/view.router.js";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import { Server } from "socket.io";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views",join( __dirname +"/views"))
app.engine('handlebars', handlebars.engine())
app.set("view engine", "handlebars");
//app.set("views",path.join(__dirname, 'views'));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.use("/", router);

mongoose.connect("mongodb+srv://PatricioHCarames:Back1234@backende-commerce.8rpdxkg.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology:true,
}).then((conn)=>{console.log("connected to MongoDB")})


const server = app.listen(8080, () => {
  console.log('Server ON')
})

const io = new Server(server);

io.on("connection", (socket)=>{
  console.log(`usuario conectado @ ${socket}`)
  socket.emit("allProducts", productManager.getProducts());
})