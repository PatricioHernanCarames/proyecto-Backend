import fs from "fs";
import path from "path";
import { __dirname } from "../../utils.js";
import { error } from "console";

class ProductManagerFile {
  constructor(pathFile) {
    this.path = path.join(__dirname, `/daos/files/${pathFile}`);
  }
  fileExists() {
    return fs.existsSync(this.path);
  }

  getNewId(products) {
    let newId;
    if (!products.length) {
      newId = 1;
    } else {
      newId = products[products.length - 1].id++;
    }
    return newId;
  }

  async addProduct(product) {
    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const newId = this.getNewId(products);
        product.id = newId;
        products.push(product);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, 2)
        );
        return product;
      } else {
        product.id = 1;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify([product], null, 2)
        );
        return product;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getProducts() {
    try {
      if (this.fileExists()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);
        return contenidoJson;
      } else {
        await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(id) {
    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const productFound = products.find(
          (product) => product.id === parseInt(id)
        );
        if (productFound) {
          return productFound;
        } else {
          throw new Error("producto no encontrado");
        }
      } else {
        throw new Error("el archivo no existye");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(id, product) {
    try {
      if (this.fileExists) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(
          (product) => product.id === parseInt(id)
        );
        if (productIndex >= 0) {
          products[productIndex] = {
            ...products[productIndex],
            ...product,
          };
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
          );
          return products[productIndex];
        } else {
          throw new Error("no se encontro el producto");
        }
      } else {
        throw new Error("archivo no existe");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProduct(id) {
    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const productFound = products.find(
          (product) => product.id === parseInt(id)
        );
        if (productFound) {
          const newProducts = products.filter(
            (product) => product.id !== parseInt(id)
          );
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(newProducts, null, 2)
          );
          return { message: "producto eliminado" };
        } else {
          throw new Error("No se encontró un producto con ese id");
        }
      } else {
        throw new Error("el arcivo no existe");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { ProductManagerFile };
