import { CartModel } from "../daos/models/cart.model.js";
import { ProductModel } from "../daos/models/product.model.js";
import { ProductManagerMongo } from "../daos/managers/mongo/productManagerMongo.js";
import { CartManagerMongo } from "../daos/managers/mongo/cartManagerMongo.js";

const cartManager = new CartManagerMongo(CartModel);
const productManager = new ProductManagerMongo(ProductModel);

export const addCart = async (req, res) => {
  try {
    const cartAdded = await cartManager.addCart();
    res.json({ status: "success", result: cartAdded, message: "cart added" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const viewCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    //obtenemos el carrito
    const cart = await cartManager.getCartById(cartId);
    res.json({ status: "success", result: cart });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartManager.getCartById(cartId);
    // console.log("cart: ", cart);
    const product = await productManager.getProductById(productId);
    // console.log("product: ", product);
    const cartUpdated = await cartManager.addProductToCart(cartId, productId);
    res.json({
      status: "success",
      result: cartUpdated,
      message: "product added",
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartManager.getCartById(cartId);
    // console.log("cart: ", cart);
    const product = await productManager.getProductById(productId);
    // // console.log("product: ", product);
    const response = await cartManager.deleteProduct(cartId, productId);
    res.json({
      status: "success",
      result: response,
      message: "product deleted",
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updateProductsInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products;
    const cart = await cartManager.getCartById(cartId);
    cart.products = [...products];
    const response = await cartManager.updateCart(cartId, cart);
    res.json({ status: "success", result: response, message: "cart updated" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products;
    const cart = await cartManager.getCartById(cartId);
    cart.products = [...products];
    const response = await cartManager.updateCart(cartId, cart);
    res.json({ status: "success", result: response, message: "cart updated" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updateQuantityInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    await cartManager.getCartById(cartId);
    await productManager.getProductById(productId);
    const response = await cartManager.updateQuantityInCart(
      cartId,
      productId,
      quantity
    );
    res.json({
      status: "success",
      result: response,
      message: "producto actualizado",
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartModel.findById(cartId);
    if (cart) {
      if (!cart.products.length) {
        return res.send(
          "es necesario que agrege productos antes de realizar la compra"
        );
      }
      const ticketProducts = [];
      const rejectedProducts = [];
      for (let i = 0; i < cart.products.length; i++) {
        const cartProduct = cart.products[i];
        const productDB = await ProductModel.findById(cartProduct.id);
        //comparar la cantidad de ese producto en el carrito con el stock del producto
        if (cartProduct.quantity <= productDB.stock) {
          ticketProducts.push(cartProduct);
        } else {
          rejectedProducts.push(cartProduct);
        }
      }
      console.log("ticketProducts", ticketProducts);
      console.log("rejectedProducts", rejectedProducts);
      const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleString(),
        amount: 500,
        purchaser: req.user.email,
      };
      const ticketCreated = await ticketsModel.create(newTicket);
      res.send(ticketCreated);
    } else {
      res.send("el carrito no existe");
    }
  } catch (error) {
    res.send(error.message);
  }
};
export const deleteAllFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    cart.products = [];
    const response = await cartManager.updateCart(cartId, cart);
    res.json({
      status: "success",
      result: response,
      message: "productos eliminados",
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
