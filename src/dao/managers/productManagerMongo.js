class ProductManagerMongo {
  constructor(model) {
    this.model = model;
  }

  async addProduct(product) {
    try {
      const data = await this.model.create(product);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`error al guardar: ${error}`);
    }
  }

  async getProducts() {
    try {
      const data = await this.model.find();
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`error al obtener: ${error}`);
    }
  }

  async getPaginateProducts(query = {}, options = {}) {
    try {
      const result = this.model.paginate(query, options);
      return result;
    } catch (err) {
      throw new Error("error al obtener: ${err}");
    }
  }

  async getProductById() {
    try {
      if (id.trim().length != 24) {
        throw new Error("el id del producto invalido");
      }
      const data = await this.model.findById(id);
      if (data) {
        const response = JSON.parse(JSON.stringify(data));
        return data;
      }
      throw new Error("no se encontro el producto");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, product) {
    try {
      const data = await this.model.findByIdAndUpdate(id, product, {
        new: true,
      });
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(
        `error al actualizar el produxcto, no se encontró el id ${id}`
      );
    }
  }

  async deleteProduct(id) {
    try {
      await this.model.findByIdAndDelete(id);
      return { message: "producto eliminado" };
    } catch (error) {
      throw new Error(`error al borrar el producto con id ${id}`);
    }
  }
}

export { ProductManagerMongo };
