import express from "express";
import ProductManager from "./ProductManager";

const app = express();
const server = 8080;


const filePath = '.api/products.json';
const productManager = new ProductManager(filePath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {
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

app.get('/products/:pid', async (req,res) =>{
    try{
    const {pid} = req.params;
    
        const item = await productManager.getProductById(pid)
        res.status(200).send(item)
    }catch(error){

        res.status(400).json({error : 'invalid id'})

    }
    
})

app.listen(server, () => {
  console.log(`Server is running on port ${server}`);
});
