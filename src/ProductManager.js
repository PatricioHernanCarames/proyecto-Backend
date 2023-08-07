const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProductsFromFile();
    this.nextId = this.calculateNextId();
  }

  
  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  }

  
  calculateNextId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  
  saveProductsToFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  
  addProduct(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      id: this.nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.nextId++;
    this.saveProductsToFile();

    return newProduct;
  }

  
  getProducts() {
    return this.products;
  }

  
  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  
  updateProduct(id, updateData) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex !== -1) {
      
      const updatedProduct = { ...this.products[productIndex], ...updateData };
      this.products[productIndex] = updatedProduct;
      this.saveProductsToFile();
      return updatedProduct;
    } else {
      throw new Error('Product not found');
    }
  }

 
  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      this.saveProductsToFile();
      return deletedProduct;
    } else {
      throw new Error('Product not found');
    }
  }
}


export default ProductManager();
