import express from "express";
import fs from "fs";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import path from "path";
import { ProductManager } from "./dao/ProductManagers.js";

const app = express();

const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const productService = new ProductManager("products.json");
const io = new Server(httpServer);

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(viewsRouter);

let messages = [];

io.on("connection", (socket) => {
  console.log("Cliente Conectado");

  socket.on("message", (data) => {
    console.log("data", data);
    messages.push(data);

    const filePath = path.join(__dirname, "files", "products.json");
    fs.readFile(filePath, "utf8", (err, fileData) => {
      if (err) {
        console.error(err);
        return;
      }

      let existingData = [];
      if (fileData) {
        existingData = JSON.parse(fileData);
      }

      const newData = existingData.concat(messages);

      fs.writeFile(filePath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error(err);
          return;
        }

        io.emit("messageHistory", newData);
      });
    });
  });
});
