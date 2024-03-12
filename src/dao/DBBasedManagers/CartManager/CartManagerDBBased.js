import { Cart } from "../../../dto/Cart/Cart.js";
import cartModel from "../../DBBasedManagers/models/cart.model.js";
import { mongoose } from "mongoose";
import { productService } from "../../../repositories/index.js";

export class CartManagerDBBased {
  async addCart(aCart) {
    try {
      return cartModel.create(aCart);
    } catch (error) {
      throw error;
    }
  }

  async getProductsFrom(aCartID) {
    try {
      const cart = await this.getCartById(aCartID);
      //Here you could show the real products by calling the ProductManager. -asalvidio
      return cart.products;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getCarts() {
    try {
      return await cartModel.find({});
    } catch (error) {
      console.error(error.message);
    }
  }

  async assertHasCarts() {
    try {
      const carts = await cartModel.findOne({});
      if (!carts) throw new Error("No hay carritos");
    } catch (error) {
      throw error;
    }
  }

  assertCartIdIsValid(anId) {
    if (!mongoose.Types.ObjectId.isValid(anId))
      throw new Error(
        `El formato del ID ${anId} no cumple con el formato de UUID`
      );
  }

  parseProducts(aProductCollection) {
    const products = aProductCollection.map((product) => product.product);
    return productService.parseProducts(products);
  }

  async getCartById(anId) {
    try {
      await this.assertHasCarts();
      this.assertCartIdIsValid(anId);
      const cart = new Cart(await cartModel.findOne({ _id: anId }).lean());
      if (!cart) throw new Error(`No se encuentra el carrito con ID ${anId}`);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  assertSatisfiesAllProductRequiredParameters = (productID) => {
    if (!productID) throw new Error("Faltan parámetros");
  };

  async hasProductAlreadyBeenAdded(aProductID, aCartID) {
    try {
      const cart = await cartModel.findOne({
        _id: aCartID,
        "products.product": aProductID,
      });
      return !!cart;
    } catch (error) {
      throw error;
    }
  }

  async assertProductIDIsValid(aProductID) {
    try {
      await productService.getProductById(aProductID);
    } catch (error) {
      throw error;
    }
  }

  async getProductByIdIn(aCartID, aProductID) {
    try {
      const foundProduct = await cartModel.findOne(
        { _id: aCartID, "products.product": aProductID },
        { "products.$": 1 }
      );
      if (foundProduct && foundProduct.products.length > 0) {
        return foundProduct.products[0];
      } else {
        throw new Error(
          `El carrito con ID ${aCartID} no tiene el producto con ID ${aProductID}`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async assertCartExists(aCartID) {
    try {
      const cart = await cartModel.findById({ _id: aCartID });
      if (!cart)
        throw new Error(`No se encuentra el carrito con ID ${aCartID}`);
    } catch (error) {
      throw error;
    }
  }

  async addProduct(aProductID, aCartID) {
    try {
      await this.assertCartExists(aCartID);
      this.assertSatisfiesAllProductRequiredParameters(aProductID);
      await this.assertProductIDIsValid(aProductID);

      if (await this.hasProductAlreadyBeenAdded(aProductID, aCartID)) {
        const { quantity } = await this.getProductByIdIn(aCartID, aProductID);
        await this.updateProductQuantityIn(aCartID, aProductID, quantity + 1);
      } else {
        await cartModel.updateOne(
          { _id: aCartID },
          { $push: { products: { product: aProductID, quantity: 1 } } }
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductOn(aCartID, aProductID) {
    try {
      this.assertCartIdIsValid(aCartID);
      await this.assertCartExists(aCartID);
      await this.assertProductIDIsValid(aProductID);
      if (await this.hasProductAlreadyBeenAdded(aProductID, aCartID)) {
        const result = await cartModel.updateOne(
          { _id: aCartID },
          { $pull: { products: { product: aProductID } } }
        );
        if (result.modifiedCount == 0) {
          throw new Error(`Hubo un error al borrar el producto`);
        }
      } else {
        throw new Error(
          `El carrito con ID ${aCartID} no tiene el producto con ID ${aProductID}`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(aCartID) {
    try {
      await cartModel.findOneAndDelete(aCartID);
    } catch (error) {
      throw error;
    }
  }

  async deleteAllProductsOn(aCartID) {
    try {
      this.assertCartIdIsValid(aCartID);
      await this.assertCartExists(aCartID);
      const result = await cartModel.updateOne(
        { _id: aCartID },
        { $set: { products: [] } }
      );
      if (result.modifiedCount == 0) {
        throw new Error(`Hubo un error al borrar todos los productos`);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateCartWith(aCartID, potentialProducts) {
    try {
      const { products } = potentialProducts;
      this.assertCartIdIsValid(aCartID);
      await this.assertCartExists(aCartID);
      const result = await cartModel.updateOne(
        { _id: aCartID },
        { $set: { products: products } }
      );
      if (result.modifiedCount == 0) {
        throw new Error(`Hubo un error al actualizar el carrito`);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantityIn(aCartID, aProductID, potentialQuantity) {
    try {
      this.assertCartIdIsValid(aCartID);
      await this.assertCartExists(aCartID);
      await this.assertProductIDIsValid(aProductID);
      if (await this.hasProductAlreadyBeenAdded(aProductID, aCartID)) {
        const result = await cartModel.updateOne(
          { _id: aCartID, "products.product": aProductID },
          { $set: { "products.$.quantity": potentialQuantity } }
        );
        if (result.modifiedCount == 0) {
          throw new Error(
            `Hubo un error al actualizar la cantidad del producto`
          );
        }
      } else {
        throw new Error(
          `El carrito con ID ${aCartID} no tiene el producto con ID ${aProductID}`
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
