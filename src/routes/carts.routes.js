import { Router } from "express";
// import { CartManagerFile } from "../daos/managers/cartManagerFile.js";
// import { ProductManagerFile } from "../daos/managers/productManagerFile.js";
import {
  addCart,
  viewCart,
  addProductToCart,
  removeProductFromCart,
  updateProductsInCart,
  updateCart,
  updateQuantityInCart,
  purchaseCart,
  deleteAllFromCart
} from "../controllers/carts.controller.js";
import { ticketsModel } from "../daos/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

//agregar carrito
router.post("/", addCart);

//ruta para listar todos los productos de un carrito
router.get("/:cid", viewCart);

//ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", addProductToCart);

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid", removeProductFromCart);

//ruta para actualizar todos los productos de un carrito.
router.put("/:cid", updateProductsInCart);

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid", updateCart);

//ruta para actualizar la cantidad de un producto en el carrito
router.put("/:cid/product/:pid", updateQuantityInCart );

router.post("/:cid/purchase", purchaseCart );

//ruta para eliminar todos los productos del carrito
router.delete("/:cid", deleteAllFromCart);

export { router as cartsRouter };
