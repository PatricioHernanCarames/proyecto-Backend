class CartManager {
    #path = "./carts.json";
    #carts = [];
  
    constructor(path) {
      this.#path = path;
      this.getCarts().then((carts) => {
        this.#carts = carts;
      });
    }
  
    async getCarts() {
      try {
        const carts = await fs.promises.readFile(this.#path);
        return JSON.parse(carts);
      } catch (error) {
        return [];
      }
    }
  
    async addCart(cart) {
      this.#carts = [...(await this.getCarts()), cart];
      await this.saveCarts();
    }

    async addToCart(cartId, productId, quantity) {
      try {
        const carts = await this.loadCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
          throw new Error(`El carrito con ID ${cartId} no existe`);
        }
        const products = carts[cartIndex].products || {};
        const productQuantity = products[productId] || 0;
        products[productId] = productQuantity + quantity;
        carts[cartIndex].products = products;
        await this.saveCarts(carts);
        return carts[cartIndex];
      } catch (error) {
        throw new Error(`Error al añadir el producto al carrito: ${error.message}`);
      }
    }
    
  
    async saveCarts() {
      try {
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts));
      } catch (e) {
        console.log(`Error guardando los archivos en  ${this.#path}`);
      }
    }
  
    getNextId() {
      return this.#carts.length + 1;
    }
  }
  
  export default CartManager;
  