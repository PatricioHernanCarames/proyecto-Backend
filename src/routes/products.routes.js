import {Router} from "express";
import {PORT} from "../app.js";

import {ProductManagerMongo} from "../daos/managers/mongo/productManagerMongo.js";
//importamos el modelo de productos
import {ProductModel} from "../daos/models/product.model.js";
import { checkValidProductFields } from "../middlewares/validations.js";
import { getProducts, productById, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";


const productManager = new ProductManagerMongo(ProductModel);

const router = Router();



router.get("/", getProducts);

router.get("/:pid", productById);

//ruta para agregar un producto
router.post("/", checkValidProductFields , addProduct);

//ruta para actualizar un producto
router.put("/:pid",checkValidProductFields, updateProduct);

//ruta para eliminar el producto
router.delete("/:pid", deleteProduct);

export {router as productsRouter};