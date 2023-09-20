class CartManager {
  
  async addProductToCart(cartId, productId, quantity) {
    try {
      
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error(`Cart with ID ${cartId} not found.`);
      }

      
      const existingProduct = cart.products.find(
        (product) => product.productId.toString() === productId
      );

      if (existingProduct) {
        
        existingProduct.quantity += quantity;
      } else {
        
        cart.products.push({ productId, quantity });
      }

      
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManager;
