import express from "express";
import productsRouter from "../routes/products.router.js"
import cartRouter from "../routes/cart.router.js"
import __dirname from "./utils.js"

const app = express();
const server = 8080;




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views",__dirname + "/views")



app.listen(server, () => {
  console.log(`Server is running on port ${server}`);
});
