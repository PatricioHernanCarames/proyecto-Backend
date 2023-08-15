import {Router, json} from 'express';
import ProductManager from '../src/api/Product.Manager';



const filePath = '.api/products.json';
const productManager = new ProductManager(filePath);

const productsRouter = Router();

productsRouter.use(json());


productsRouter.get("api/products", (req, res) => {
    const limit = req.query.limit;
  
    try {
      if (!limit) {
        const products = productManager.getProducts();
        res.send(products);
      } else {
        const limitNum = parseInt(limit, 10);
  
        if (isNaN(limitNum)) {
          res.status(400).json({ error: "invalid limit number" });
        } else {
          const prods = productManager.getProducts().slice(0, limit);
          return res.send.json(prods);
        }
      }
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  });
  
  productsRouter.get('/api/products/:pid', async (req,res) =>{
      try{
      const {pid} = req.params;
      
          const item = await productManager.getProductById(pid)
          res.status(200).send(item)
      }catch(error){
  
          res.status(400).json({error : 'invalid id'})
  
      }
      
  })
  
  productsRouter.post("/", uploader.single("thumbnail"), async (req, res) => {
    const { title, description, price, stock, code, status, category } = req.body;
  
    
  
    let thumbnail=(req.file.path);
    req.body.thumbnail = thumbnail;
    try {
      const task = productsModel(req.body);
      console.log(task);
  
      await task.save();
  
      res.status(201).send(task);
    } catch (e) {
      res.status(500).send({ status: "error", payload: e.message });
    }
  });

  export default productsRouter