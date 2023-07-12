import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";
import { ProductManager } from "../dao/ProductManagers.js";

const cartService = new CartManager("carts.json");
const productService = new ProductManager("products.json");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cartCreated = await cartService.addCarts();
    res.json({ status: "Success", data: cartCreated });
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartService.getCartsById(cartId);

    if (cart) {
      res.json({ status: "Success", data: cart, message: "Producto Encontrado" });
    } else {
      res.json({ status: "Error", message: "Producto no encontrado" });
    }
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = await cartService.UpdatedCart(cartId, productId);
    res.json({ status: "Success", data: updatedCart, message: "Carrito actualizado" });
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

export { router as cartsRouter };