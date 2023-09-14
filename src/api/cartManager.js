class CartManager {
  async addCart(cart) {
    const newCart = new Cart(cart);
    await newCart.save();
    return newCart;
  }

  async getCart() {
    return await cart.find();
  }

  async addToCart(cartId, productId, quantity) {
    const cart = await Cart.findBId(cartId);

    if (!cart) {
      throw new Error(`the cart id ${cartId} does not exist`);
    }
    const productIndex = cart.findIndex(p=>p.productId.toString() === productId)
    if (productIndex > -1){
      cart.products[productIndex].quantity += quantity;
      console.log('updated', cart.products[productIndex])
    }else{
      cart.products.push({productId,quantity});
    }
    await cart.save();
    return cart;

  }

  async deleteCartById(cartId){
    return await Cart.findByIdAndDelete(cartId);
  }
}
export default CartManager;
