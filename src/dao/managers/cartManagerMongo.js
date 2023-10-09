import mongoose from "mongoose";

class CartManagerMongo {
  constructor(model) {
    this.model = model;
  }
  async getCarts() {
    try {
      const data = await this.model.find();
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addCart() {
    try {
      const cart = {};
      const data = await this.model.create(cart);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`error al guardar${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      if (id.trim().length != 24) {
        throw new Error(`el id delcarrito es erroneo`);
      }
      const data = await this.model.find({ _id: id });
      if (data) {
        const response = JSON.parse(JSON.stringify(data));
        return response[0];
      }
      throw new Error(`no se encontro el carrito con el ${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async addToCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.products.findIndex(
        (prod) => prod.id == productId
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity = cart.products[productIndex]
          .quantity++;
      } else {
        cart.products.push({
          id: productId,
          quantity: 1,
        });
      }
      const data = await this.model.findByIdAndUpdate(cartId, cart, {
        new: true,
      });
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.product.findIndex(
        (prod) => prod.id == productId
      );
      if (productIndex >= 0) {
        const newProducts = cart.products.filter(
          (prod) => prod.id != productId
        );
        cart.products = [...newProducts];
        const data = this.model.findByIdAndUpdate(cartId, cart, { new: true });
      } else {
        throw new Error("No se encontro el producto");
      }
    } catch (error) {
      throw new Error(`Error al eliminar el producto ${error.message}`);
    }
  }
  async updateCart(id, cart) {
    try {
      await this.model.findByIdAndUpdate(id, cart);
      return "carrito actualizado";
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateQuantityInCart(cartid, productId, quantity) {
    try {
      const cart = await this.getCartById(cartid);
      const productIndex = cart.products.findIndex(
        (prod) => prod.id == productId
      );
      if (productIndex >= 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        throw new Error("no existe ese producto");
      }
      const data = await this.model.findByIdAndUpdate(cartid, cart, {
        new: true,
      });
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export {CartManagerMongo};
