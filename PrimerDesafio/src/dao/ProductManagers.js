import fs from "fs"
import { __dirname } from "../utils.js"
import path from "path"

export class ProductManager {
  constructor(fileName){
    this.path=path.join(__dirname,`/files/${fileName}`)
  }

  fileExists() {
    return fs.existsSync(this.path)
  }

  async getProducts() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, 'utf-8');
        const contentJson = JSON.parse(content);
        return contentJson;
      } else {
        throw new Error('El archivo no existe');
      }
    } catch (error) {
      console.log('Error al leer el archivo:', error);
      return [];
    }
  }
  
  async addProduct(newProduct) {
    try {
      if (this.fileExists()) {
        const productsData = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(productsData)

        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price ||!newProduct.status || !newProduct.stock || !newProduct.category) {
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
          ...newProduct
        };
  
        products.push(productToAdd)
  
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        return {
          id: newId,
          ...newProduct
        };
      }
    } catch (error) {
      throw error
    }
  }
  
  async getProductById(id) {
    try {
      if (this.fileExists()) {
        const findId = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(findId);

        const product = products.find((product) => product.id === id)

        if (product) {
          return product
        } else {
          return undefined
        }
      } else {
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

