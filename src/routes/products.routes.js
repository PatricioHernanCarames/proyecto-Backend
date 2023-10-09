import { Router } from "express";
import { PORT } from "../app.js";
import { ProductManagerMongo } from "../dao/managers/productManagerMongo.js";

import { ProductModel } from "../dao/models/product.model.js";
import { checkValidProductFields } from "../middlewares/validations.js";

const productManager = new ProductManagerMongo(ProductModel);

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, stock, sort = "asc" } = req.query;
    const stockValue = stock == 0 ? undefined : parseInt(stock);
    if (!["asc", "desc"].includes(sort)) {
      return res.json({ status: "error", message: "orden no valido" });
    }
    const sortValue = sort === "asc" ? 1 : -1;
    let query = {};
    if (category && stockValue) {
      query = { category: category, stock: { $gte: stockValue } };
    } else {
      if (category || stockValue) {
        query = { category: category };
      } else {
        query = { stock: { $gte: stockValue } };
      }
    };
    const result = await productManager.getPaginateProducts(
        query,{
            page,
            limit,
            sort:{price:sortValue},
            lean:true,

        }
    );
        const baseUrl= req.protocol+"://" +req.get("host")+req.originalUrl;
        res.json({
            status:"success",
            payload:result.docs,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.prevLink?`${baseUrl}?page=${result.prevPage}`:null,
            nextLink: result.nextLink? `${baseUrl}?page=${result.prevPage}`: null
        });
  } catch (error) {
    res.status(400).json({status:"error", message:error.message});
  }
});

router.get("/:pid", async (req,res)=>{
    try {
        const {pid} =req.params;
        const product= await productManager.getProductById(pid)
        res.status(200).json({success: "success", result:product});

    } catch (error) {
        res.status(400).json({message:error.message});
    }
});


router.post("/", checkValidProductFields, async(req,res)=>{
    try {
        const body = req.body;
        body.status = Boolean(body.status)
        body.price =Number(body.price);
        body.stock = Number(body.stock);
        const productAdded =await productManager.addProduct(body);
        res.json({status:"success", result: productAdded, message: "product added"})
    } catch (error) {

      res.status(400).json({status: "error", error: error.message});
        
    }
})

router.put("/:pid", checkValidProductFields, async(req,res)=>{
    try {
        
       const productId = req.params.pid;
       const body= req.body;
    body.status= Boolean(body.status) ;
    body.price= Number(body.price);
    body.stock= Number(body.stock);
    
    const productUpdated  =   await    ProductManager.updateProducd(productId ,body );
    res.json({status: "succes" , result:productUpdated, message:" producto actuslizado" })

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.delete("/:pid", async(req,res)=>{
    try {
        const productId= req.params.pid

        const productDeleted = await productManager.deleteProduct(productId)
        res.json({status:"success", result:productDeleted, message:"Producto eliminado"})
    } catch (error) {
        res.json({status:error, message:error.message});
    };
});

export {router as productsRouter};
