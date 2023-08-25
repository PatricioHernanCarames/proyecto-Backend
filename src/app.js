import express from "express";
import { join } from "path";
import productsRouter from "../routes/products.router.js";
import cartRouter from "../routes/cart.router.js";
import viewsRouter from "../routes/view.router.js";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import { Server } from "socket.io";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebars.engine())
app.set("view engine", "handlebars");
app.set("views", join(__dirname, 'views'));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.use("/", viewsRouter);

const server = app.listen(8080, () => {
  console.log('Server ON')
})

const io = new Server(server);

io.on("connection", (socket)=>{
  console.log(`usuario conectado @ ${socket}`)
  socket.emit("allProducts", productManager.getProducts());
})