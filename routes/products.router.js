import { Router, json } from "express";
import Product from "../dao/models/ProductModel.js";
import fs from "fs"; // Import the fs module for file system operations

const productsRouter = Router();

productsRouter.use(json());

productsRouter.get("/api/products", async (req, res) => {
  const limit = req.query.limit;

  try {
    if (!limit) {
      const productsFromDB = await Product.find();

      const productsFromFile = fetchProductsFromFile();

      const mergedProducts = mergeProducts(productsFromDB, productsFromFile);

      res.render("products", { products: mergedProducts });

      io.emit("products", { products: mergedProducts });
    } else {
      const limitNum = parseInt(limit, 10);

      if (isNaN(limitNum)) {
        res.status(400).json({ error: "Invalid limit number" });
      } else {
        const productsFromDB = await Product.find().limit(limitNum);

        const productsFromFile = fetchProductsFromFile().slice(0, limitNum);

        const mergedProducts = mergeProducts(productsFromDB, productsFromFile);

        res.json(mergedProducts);
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.get("/api/products/:pid", async (req, res) => {
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
