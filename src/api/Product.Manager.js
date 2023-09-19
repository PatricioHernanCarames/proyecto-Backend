import Product from "../../dao/models/ProductModel";

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
  async getProducts(pageNumber, pageSize) {
    try{
      const skip = (pageNumber-1)*pageSize;

   const products = await Product.find()
      .skip(skip)
      .limit(pageSize);

    const totalProducts = await Product.countDocuments();

    const totalPages = Math.ceil(totalProducts/pageSize);

    const hasPrevPage = pageNumber > 1;

    const hasNextpage = pageNumber < totalPages;

    const prevPage = hasPrevPage ? pageNumber - 1 : null;

    const nextPage = hasNextpage ? pageNumber + 1 : null;

    const prevLink = hasPrevPage ? `/api/products?page=${prevPage}&pagesize=${pageSize}` : null;

    const nextlink = hasNextpage ? `/api/products?page=${nextPage}&pagesize=${pageSize}` : null;

    const response = {
      status: 'success',
      payload : products,
      totalPages,
      prevPage,
      nextPage,
      page : pageNumber,
      hasPrevPage,
      hasNextpage,
      prevLink,
      nextlink,
    };

    return response;
    } catch (error){
    console.error('error getting products: ', error);
    throw error;
  }
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
