import { Router } from "express";
import { ProductManager } from "../dao/ProductManagers.js";

const productService = new ProductManager('products.json');
const router = Router();

router.get("/", async (req, res) => {
  const products = await productService.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productService.getProducts();
  res.render("realTimeProducts", { products });
});

export { router as viewsRouter };
