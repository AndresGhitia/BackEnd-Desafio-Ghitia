import fs from "fs"

export class ProductManager {
  constructor(path) {
    this.path = path
  }

  fileExists() {
    return fs.existsSync(this.path)
  }

  async getProducts() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, 'utf-8')
        const contentJson = JSON.parse(content)
        return contentJson
      } else {
        throw new Error('El archivo no existe')
      }
    } catch (error) {
      console.log('Error al leer el archivo', error)
      return []
    }
  }

  async addProduct(newProduct) {
    try {
      if (this.fileExists()) {
        const productsData = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(productsData)

        if (!newProduct.title ||!newProduct.description ||!newProduct.thumbnail ||!newProduct.price ||!newProduct.code ||!newProduct.stock) {
          console.log('Todos los campos deben ser completados')
          return
        }

        const codeRepeat = products.some((product) => product.code === newProduct.code);
        if (codeRepeat) {
          console.log(`El código "${newProduct.code}" ya está en uso.`)
          return
        }

        let newId;
        if (!products.length) {
          newId = 1
        } else {
          newId = products[products.length - 1].id + 1
        }

        const productToAdd = {
          id: newId,
          ...newProduct,
        };

        products.push(productToAdd)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        console.log('Producto Agregado Exitosamente')
      }
    } catch (error) {
      console.log('Error al leer el archivo de productos:', error)
      return undefined;
    }
  }

  async getProductById(id) {
    try {
      if (this.fileExists()) {
        const findId = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(findId);

        const product = products.find((product) => product.id === id)

        if (product) {
          console.log('Producto encontrado')
          return product
        } else {
          console.log('Producto no encontrado')
          return undefined
        }
      } else {
        console.log('El archivo no existe')
        return undefined
      }
    } catch (error) {
      console.log('Error al leer el archivo:', error)
      return undefined
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      if (this.fileExists()) {
        const findId = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(findId);

        const productId = products.findIndex((product) => product.id === id)

        if (productId !== -1) {
          const updatedProduct = {
            id,
            ...products[productId],
            ...updatedFields,
          };

          products[productId] = updatedProduct

          await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
          console.log('Producto actualizado')
        } else {
          console.log('No se encontró el producto')
        }
      } else {
        console.log('El archivo no existe')
      }
    } catch (error) {
      console.log('Error al leer o escribir el archivo:', error)
    }
  }

  async deleteProduct(id) {
    try {
      if (this.fileExists()) {
        const productsData = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsData);

        const productId = products.findIndex((product) => product.id === id);

        if (productId !== -1) {
          products.splice(productId, 1);

          await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
          console.log('Producto Eliminado')
        } else {
          console.log('Producto no encontrado')
        }
      } else {
        console.log('El archivo no existe')
      }
    } catch (error) {
      console.log('Error al leer o escribir el archivo:', error);
    }
  }

  async getProducts(limit) {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, 'utf-8')
        const contentJson = JSON.parse(content)
        
        if (limit && typeof limit === 'number') {
          return contentJson.slice(0, limit)
        } else {
          return contentJson
        }
      } else {
        throw new Error('El archivo no existe')
      }
    } catch (error) {
      console.log('Error al leer el archivo', error)
      return []
    }
  }  
}

// module.exports = ProductManager;

// const productManager = require('./ProductManagers.js');
// const manager = new productManager('./Products.json');

// const operaciones = async()=>{

//   await manager.addProduct({
//     title:'Batata',
//     description: 'Verdura',
//     thumbnail: 'Batata.jpg',
//     price: 40,
//     code: 'AAA-0451',
//     stock: 25,
//   })

//   const products = await manager.getProducts();
//   console.log("Productos Guardados",products);

//   console.log("...Buscando Producto...")
//   const productById = await manager.getProductById(2);
//   console.log(productById)

//   const productToUpdateId = 2;
//   const updatedFields = {
//     stock: 200,
//   };
  
//   await manager.updateProduct(productToUpdateId, updatedFields)
  
//   console.log("...Buscando Producto...")
//   const productDelete = await manager.deleteProduct(11)
//   console.log(productDelete)
  
// }

// operaciones()