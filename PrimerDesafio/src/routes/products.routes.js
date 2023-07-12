import { Router } from "express";
import { ProductManager } from "../dao/ProductManagers.js";

const productService = new ProductManager('products.json');

const validateFields = async (req, res, next) => {
  const newProduct = req.body;

  if (!newProduct.title || !newProduct.description || !newProduct.thumbnail || !newProduct.price || !newProduct.code || !newProduct.stock) {
    return res.json({ status: "error", message: "Todos los campos deben ser completados" });
  }

  try {
    const products = await productService.getProducts();
    const codeRepeat = products.some((product) => product.code === newProduct.code);

    if (codeRepeat) {
      return res.json({ status: "error", message: `El código "${newProduct.code}" ya está en uso.` });
    }

    next();
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const contentJson = await productService.getProducts();
    
    if (limit && typeof limit === 'number') {
      return res.json(contentJson.slice(0, limit));
    } else {
      res.json({ status: "Success", data: contentJson });
    }
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productService.getProductById(productId);

    if (product) {
      res.json({ status: "Success", data: product, message: "Producto Encontrado" });
    } else {
      res.json({ status: "Error", message: "Producto no encontrado" });
    }
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

router.post("/", validateFields, async (req, res) => {
  try {
    const newProduct = req.body;
    const productCreated = await productService.addProduct(newProduct);
    res.json({ status: "Success", data: productCreated, message: "Producto Creado" });
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    await productService.updateProduct(productId, updatedFields);
    res.json({ status: "Success", message: "Producto Actualizado" });
  } catch (error) {
    res.json({ status: "Error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try{
    const productId = parseInt(req.params.pid);
    const productDeleted = await productService.deleteProduct(productId)
    res.json({ status: "Success", data: productDeleted, message: "Producto Elimiando"})
  } catch (error) {
    res.json({ status: "Error", message: error.message})
  }
});

export { router as productsRouter };