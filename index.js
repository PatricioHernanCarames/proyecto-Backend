class ProductManager {
  nextId = 0;
  products = [];

  addProduct(title, description, price, thumbnail, stock, code) {
      let codeExists = this.products.some((p) => p.code === code);

      if (!codeExists) {
          const newProduct = {
              id: this.nextId,
              title,
              description,
              price,
              thumbnail,
              stock: Number(stock), 
              code,
          };

          this.products.push(newProduct); 
          this.nextId++;

          
      } else {
          throw new Error(`El producto con código ${code} ya existe`);
      }
  }

  getProducts() {
      return this.products;
  }

  getProductById(id) {
      let product = this.products.find((product) => product.id === id);

      if (product) {
          return product;
      } else {
          throw new Error("Product not found");
      }
  }
}

const manager = new ProductManager();

console.log(manager);

try {
  manager.addProduct("Laptop", "Laptop computer", 1000, "this.jpg", 100, 236);
  manager.addProduct("Gamer PC", "Desktop computer", 10000, "this.jpg", 100, 237);
  manager.addProduct("Gamer headset", "Accessories", 70, "this.jpg", 100, 238);

  console.log(manager);

  let prod = manager.getProductById(0);
  console.log(prod);

  manager.addProduct("Desktop switch", "Ethernet", 20, "this.jpg", 100, 238);

  let prods = manager.getProducts();
  console.log(prods);
} catch (error) {
  console.log(error.message);
}