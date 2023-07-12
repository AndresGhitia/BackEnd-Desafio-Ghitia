import express from "express"
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";

const port = 8080;
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter )

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});