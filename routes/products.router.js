import { Router, json } from "express";
import Product from "../dao/models/ProductModel.js";
const productsRouter = Router();

productsRouter.use(json());

productsRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || "price";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const products = await Product.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        totalProducts,
        limit,
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});




productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const itemFromDB = await Product.findById(pid);

    if (itemFromDB) {
      res.status(200).json(itemFromDB);
    } else {
      const itemFromFile = fetchProductFromFile(pid);

      if (itemFromFile) {
        res.status(200).json(itemFromFile);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid id" });
  }
});

router.get('/products', async (req, res)=>{
  try {
    const products = await Product.find();
    res.render('products', {products});
  } catch (error) {
    console.error(error);
    res.ststus(500).send('An error ocurred loading products DB')
  }
})

function fetchProductsFromFile() {
  try {
    const data = fs.readFileSync(`${__dirname}/api/products.json`, "utf-8");
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

function fetchProductFromFile(productId) {
  const products = fetchProductsFromFile();
  return products.find((product) => product.id === productId);
}

function mergeProducts(productsFromDB, productsFromFile) {
  const uniqueProductsMap = new Map();

  for (const product of productsFromDB) {
    uniqueProductsMap.set(product.id, product);
  }

  for (const product of productsFromFile) {
    uniqueProductsMap.set(product.id, product);
  }

  const mergedProducts = Array.from(uniqueProductsMap.values());

  return mergedProducts;
}



export default productsRouter;
