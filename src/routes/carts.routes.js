import { Router, response } from "express";
import {CartManagerMongo} from "../dao/managers/cartManagerMongo.js";
import {ProductManagerMongo} from "../dao/managers/productManagerMongo.js";
import {CartModel} from "../dao/models/cart.model.js";
import {ProductModel} from "../dao/models/product.model.js";

const cartManager = new CartManagerMongo(CartModel);

const productManager = new ProductManagerMongo(ProductModel);

const router = Router();

router.post("/", async (req,res)=>{
    try {
        const cartAdded = await cartManager.addCart();
        res.json({status:"success", result: cartAdded, message: "cart added"});

    } catch (error) {
       res.status(400).json({status:"error", error: error.message}) ;
    };
});

router.get("/:cid", async (req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);

        const product = await productManager.getProductById(productId);

        const response = await cartManager.addProductToCart(cartId, productId);
        res.json({status:"success", result: response, message:"product deleted"})
    } catch (error) {
       res.status(400).json({status: "error", error:error.message}) ;
    };
});

router.put("/:cid", async (req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartManager.getCartById(cartId);
        cart.products=[...products]
        const response = await cartManager.updateCart(cartId, cart);

        res.json({status: "success", result:response, message:"carrito actualizado"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    };
});

router.put("/:cid", async (req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartManager.getCartById(cartId);
        cart.products=[...products];
        const response = await cartManager.updateCart(cartId, cart);
        res.json({status:"success", result: response, message: "carrito actualizado"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message})
    };
});

router.put("/:cid/product/:pid", async (req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId= req.params.pid;
        const quantity = req.body.quantity;
        await cartManager.getCartById(cartId);
        await productManager.getProductById(productId);
        const response = await cartManager.updateQuantityInCart(cartId, productId, quantity );
        res.json({status: "success", result:response, message:"producto actualizado"});

    } catch (error) {
       res.status(400).json({status:error, error:error.message}) ;
    };
});

router.delete("/:cid", async (req,res)=>{
    try {
        const cartId=req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        cart.products=[];
        const response= await cartManager.updateCart(cartId, cart);
        res.json({status:"susccess", result:response, message:"productos eliminados"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    };
});

export {router as cartsRouter};