import { Router, json } from 'express';
import ProductManager from '../src/api/Product.Manager.js'; // Check the path to the ProductManager file


const filePath = `${__dirname}/api/products.json`; 
const productManager = new ProductManager(filePath);

const productsRouter = Router();

productsRouter.use(json());


productsRouter.get("/api/products", (req, res) => {
  const limit = req.query.limit;

  try {
    if (!limit) {
      const products = productManager.getProducts();
      res.send(products);
    } else {
      const limitNum = parseInt(limit, 10);

      if (isNaN(limitNum)) {
        res.status(400).json({ error: "Invalid limit number" });
      } else {
        
        const prods = productManager.getProducts().slice(0, limitNum);
        res.json(prods); 
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


productsRouter.get('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const item = await productManager.getProductById(pid);
    res.status(200).send(item);
  } catch (error) {
    res.status(400).json({ error: 'Invalid id' });
  }
});



export default productsRouter;
