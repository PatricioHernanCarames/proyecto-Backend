import express from "express";
import Cart from "../dao/models/cartModel.js";
import Product from "../dao/models/ProductModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({
      products: [],
    });

    await newCart.save();

    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error in creating a cart", error);
    res.status(500).send("error creating an cart");
  }
});

router.get("/:id", async (req, res) => {
  try {
    Cart.findByIdAndRemove(id);
    res.status(200).json({ message: `Cart with ID ${id} deleted` });
  } catch (error) {
    console.error("Error deleting the cart", error);
    res.status(500).send("error deleting Cart");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params;
  try {
    const Cart = await Cart.findById(id);
    if (cart) {
      res.status(200).json(Cart);
    } else {
      res.status(404).send("cart not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error getting Cart");
  }
});

router.post("/:id/products/:pid", async (req, res) => {
  const { id, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      res.status(404).send(`Cart with ID ${id} not found`);
      return;
    }
    cart.products.push({ productId: pid, quantity });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("error adding product to cart");
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      res.status(404).send(`Cart with ID ${id} not found`);
      return;
    }
    const productIndex = cart.products.findIndex(
      (product) => product.productId == pid
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).send(`Product with ID ${pid} not found in the cart`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the product from the cart");
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      res.status(404).send(`Cart with ID ${cid} not found`);
      return;
    }

    cart.products = products;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.send(500).send("Error updating the cart");
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      res.sendStatus(404).send(`Cart with ID ${cid} not found`);
      return;
    }

    const productToUpdate = cart.product.find(
      (product) => product.productId == pid
    );
    if (productToUpdate) {
      productToUpdate.quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).send(`product with ID ${id} not found in the cart`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the product quantity in the cart");
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    if (!cart) {
      res.status(404).send(`Cart with ID ${cid} not found`);
      return;
    }
    cart.products = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error clearing the cart");
  }
});

export default router;
