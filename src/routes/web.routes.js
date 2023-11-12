import {Router} from "express";
import {ProductManagerMongo} from "../daos/managers/mongo/productManagerMongo.js";
import {ProductModel} from "../daos/models/product.model.js";
import { CartManagerMongo } from "../daos/managers/mongo/cartManagerMongo.js";
import { CartModel } from "../daos/models/cart.model.js";
import { mailContact, renProducts, viewCart, viewProds } from "../controllers/web.controller.js";

const router = Router();

const productManager = new ProductManagerMongo(ProductModel);
const cartManager = new CartManagerMongo(CartModel);

router.get("/",(req,res)=>{
    res.render("chat");
});

router.get('/mail',(req,res)=>{
    res.render("contactUs")
})

router.post("/contact", mailContact)

router.get("/products",renProducts);

router.get("/products/:pid",viewProds);

router.get("/cart/:cid",viewCart);

//rutas vistas autenticacion
router.get("/signup",(req,res)=>{
    res.render("signup");
});

router.get("/login",(req,res)=>{
    res.render("login");
});

export {router as webRouter}