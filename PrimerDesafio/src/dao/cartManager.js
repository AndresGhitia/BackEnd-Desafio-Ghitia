import fs from "fs";
import { __dirname } from "../utils.js";
import path from "path";

export class CartManager {
  constructor(fileName) {
    this.path = path.join(__dirname, `/files/${fileName}`);
  }

  fileExists() {
    return fs.existsSync(this.path);
  }

  async getCarts() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        return carts;
      } else {
        throw new Error("Carrito no existe");
      }
    } catch (error) {
      console.log("Error al leer el archivo:", error);
      return [];
    }
  }

  async addCarts() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        let newId;
        if (!carts.length) {
          newId = 1;
        } else {
          newId = carts[carts.length - 1].id + 1;
        }
        const newCart = { id: newId, products: [] };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return newCart;
      }
    } catch (error) {
      throw error;
    }
  }

  async getCartsById(cartId) {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);

        const selectedCart = carts.find((cart) => cart.id === cartId);

        if (selectedCart) {
          return selectedCart;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } catch (error) {
      console.log("Error al leer el archivo:", error);
      return undefined;
    }
  }

  async UpdatedCart(selectedCartId, productId) {
    try {
      const selectedCart = await this.getCartsById(selectedCartId);
      if (!selectedCart) {
        throw new Error("El carrito seleccionado no existe");
      }

      const existingProduct = selectedCart.products.find((prod) => prod.product === productId);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        selectedCart.products.push({product: productId, quantity: 1,});
      }
      const content = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
      const updatedCarts = carts.map((cart) => {
        if (cart.id === selectedCartId) {
          return selectedCart;
        }
        return cart;
      });

      await fs.promises.writeFile(this.path,JSON.stringify(updatedCarts, null, "\t"));
      return selectedCart;
    } catch (error) {
      console.log("Error al actualizar el carrito:", error);
      throw error;
    }
  }
}
