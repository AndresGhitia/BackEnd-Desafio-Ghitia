const socketClient = io();

const chatbox = document.getElementById("chatbox");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("messageLogs");

function validateFields() {
  const fields = [chatbox, description, code, price, stock, category];
  const allFieldsCompleted = fields.every(field => field.value.trim() !== '');
  sendButton.disabled = !allFieldsCompleted;
}

chatbox.addEventListener("input", validateFields);
description.addEventListener("input", validateFields);
code.addEventListener("input", validateFields);
price.addEventListener("input", validateFields);
stock.addEventListener("input", validateFields);
category.addEventListener("input", validateFields);

sendButton.addEventListener("click", () => {
  const newProduct = {
    title: chatbox.value,
    description: description.value,
    code: code.value,
    price: parseFloat(price.value),
    status: true,
    stock: parseInt(stock.value),
    category: category.value
  };

  addProduct(newProduct);

  chatbox.value = "";
  description.value = "";
  code.value = "";
  price.value = "";
  stock.value = "";
  category.value = "";

  sendButton.disabled = true;
});

function sendNewProduct(newProduct) {
  socketClient.emit("message", newProduct);
}

socketClient.on("messageHistory", (dataServer) => {
  let productsList = "";

  dataServer.forEach((item) => {
    productsList += `
      <div>
        <h2>${item.title}</h2>
        <p>Description: ${item.description}</p>
        <p>Code: ${item.code}</p>
        <p>Price: $${item.price}</p>
        <p>Stock: ${item.stock}</p>
        <p>Category: ${item.category}</p>
      </div>
    `;
  });

  chat.innerHTML = productsList;
});

async function addProduct(newProduct) {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProduct)
    });

    if (response.ok) {
      const product = await response.json();
      console.log("Product added:", product);
      sendNewProduct(product);
    } else {
      console.error("Error adding product:", response.status);
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
}
