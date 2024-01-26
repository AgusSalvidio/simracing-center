import { Cart } from "../../../main/Cart/Cart.js";
import cartModel from "../../models/cart.model.js";
import { mongoose } from "mongoose";
import { productManager } from "../ManagerSystem/ManagerSystem.js";

export class CartManagerDBBased {
  async initializeCartUsing(products) {
    try {
      return new Cart({
        id: null, //Made this way to later when recreating the object, set db ID. -asalvidio
        products,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addCart() {
    try {
      const cart = await this.initializeCartUsing([]);
      cartModel.create(cart);
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

  async getCartById(anId) {
    try {
      await this.assertHasCarts();
      this.assertCartIdIsValid(anId);
      const cart = await cartModel.findOne({ _id: anId });
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
        "products.productID": aProductID,
      });

      return !!cart;
    } catch (error) {
      throw error;
    }
  }

  async assertProductIDIsValid(aProductID) {
    try {
      await productManager.getProductById(aProductID);
    } catch (error) {
      throw error;
    }
  }

  getProductFilteredBy(aCriteria, aProductCollection) {
    return aProductCollection.find(aCriteria);
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

      const cart = await this.getCartById(aCartID);
      let products = cart.products;
      const productFilterCriteria = (product) =>
        product.productID === aProductID;

      if (await this.hasProductAlreadyBeenAdded(aProductID, aCartID)) {
        let productToUpdate = this.getProductFilteredBy(
          productFilterCriteria,
          products
        );
        const index = products.indexOf(productToUpdate);
        productToUpdate.quantity++;

        if (~index) {
          products[index] = productToUpdate;
        }
      } else {
        products.push({ product: aProductID, quantity: 1 });
      }

      await cartModel.findByIdAndUpdate(
        { _id: aCartID },
        { products: products }
      );
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
          { $pull: { products: { productID: aProductID } } }
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
}
