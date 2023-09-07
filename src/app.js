import express from "express";
import mongoose from "mongoose";
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

mongoose.connect("mongodb+srv://PatricioHCarames:Back1234@backende-commerce.8rpdxkg.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology:true,
});

const db =mongoose.connection();

db.on("error", (error)=>{
  console.log(`Error ${error}`);  });

  db.once("open",()=>{
    console.log("Connected to mongoDB")
  })

const server = app.listen(8080, () => {
  console.log('Server ON')
})

const io = new Server(server);

io.on("connection", (socket)=>{
  console.log(`usuario conectado @ ${socket}`)
  socket.emit("allProducts", productManager.getProducts());
})