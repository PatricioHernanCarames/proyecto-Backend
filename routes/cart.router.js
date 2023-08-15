import express from "express";
import CartManager from "../api/cart.manager.js";

const router = express.Router();
const cartManager = new CartManager("./carrito.json");


router.post("/:nc", async (req, res) => {
    
  try {
    const newCart = {
      id: cartManager.getNextId(),
      products: [],
    };
    cartManager.addCart(newCart);
    res.status(201).json(newCart);
    res.send(newCart);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el carrito");
  }

  
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await cartManager.deleteCartById(id);
    res.status(200).json({ message: `Carrito con id ${id} eliminado` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el carrito");
  }
});

router.get("/:cid",async(req, res)=>{
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);

  if(cart){
    res.status(200).json(cart);
  }else{
    res.status(400).send("el carrito no existe")
  }
});

router.post("/:cid/products/:pid", async(req,res)=>{
  const { cid, pid } = req.params;
  const {quantity}= req.body;

  const product = await cartManager.getProductById(pid);

  if(!product){
    return res.status(404).send("el producto no existe");
  }
  
  const result = await cartManager.addProductToCart(cid, pid, quantity);

  if (result){
    res.json(result);
    res.send(result);
  }else{
    res.status(404).send(`El carrito ${cid} no existe`);
  }

  

})

export default router;