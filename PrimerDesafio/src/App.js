import express from "express"
import { ProductManager } from "./ProductManagers.js"

const port = 8080;
const app = express()

app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto: ${port}`)
});

const productService = new ProductManager("./src/Products.json")

app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit)
  const result = await productService.getProducts(limit)
  res.send(result)
})

app.get("/products/:pid", async(req, res) => {
    const pid = parseInt(req.params.pid)
    const result = await productService.getProductById(pid)
    if (result) {
        res.send(result) 
      } else {
        res.status(404).send({ error: "El producto no existe" })
    }
})