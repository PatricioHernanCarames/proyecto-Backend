import express from "express";
import { join } from "path";
import productsRouter from "../routes/products.router.js";
import cartRouter from "../routes/cart.router.js";
import viewsRouter from "../routes/view.router.js";
import __dirname from './utils.js';

const app = express();
const server = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "handlebars");
app.set("views", join(__dirname, 'views'));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.use("/", viewsRouter);

app.listen(server, () => {
  console.log(`Server is running on port ${server}`);
});
