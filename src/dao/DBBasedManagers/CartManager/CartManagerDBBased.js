import { Cart } from "../../../main/Cart/Cart.js";
import cartModel from "../../models/cart.model.js";
import { mongoose } from "mongoose";

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
      const cart = await cartModel.findById(anId);
      if (!cart) throw new Error(`No se encuentra el carrito con ID ${anId}`);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  assertSatisfiesAllProductRequiredParameters = (productID) => {
    if (!productID) throw new Error("Faltan parámetros");
  };

  async hasProductAlreadyBeenAdded(aProductID, products) {
    try {
      const sameProductID = (product) => product.productID === aProductID;
      return products.some(sameProductID);
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

  async addProduct(aProductID, aCartID) {
    try {
      this.assertSatisfiesAllProductRequiredParameters(aProductID);
      //await this.assertProductIDIsValid(aProductID);

      const cart = await this.getCartById(aCartID);
      let products = cart.products;
      const productFilterCriteria = (product) =>
        product.productID === aProductID;

      if (await this.hasProductAlreadyBeenAdded(aProductID, products)) {
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
        products.push({ productID: aProductID, quantity: 1 });
      }

      await cartModel.findByIdAndUpdate(
        { _id: aCartID },
        { products: products }
      );
    } catch (error) {
      throw error;
    }
  }
}
