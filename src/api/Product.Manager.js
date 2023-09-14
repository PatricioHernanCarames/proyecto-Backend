class ProductManager {
  async addProduct(title, description, price, thumbnail, code, stock) {
    const product = new Product({
      title: title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    await product.save();
    return product;
  }
  async getProducts() {
    return await Product.find();
  }
  async getProductById(){
    return await Product.findById(id);
  }
  async updateProduct(){
    return await Product.findByIdAndUpdate(id, updateData, {new:true});
  }
  async deleteProduct(id){
    return  await Product.findByIdAndDelete(id);
  }
  
}
