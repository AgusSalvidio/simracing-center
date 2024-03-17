import { Cart } from "../dto/Cart/Cart.js";

export default class CartRepository {
  constructor(cartDao) {
    this.dao = cartDao;
  }

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
      return await this.dao.addCart(cart);
    } catch (error) {
      throw error;
    }
  }

  async addCustomCart(anID, aProductCollection) {
    try {
      const cart = new Cart({
        id: null,
        aProductCollection,
      });
      cart._id = new mongoose.Types.ObjectId(anID);
      return await this.dao.addCart(cart);
    } catch (error) {
      throw error;
    }
  }

  async getCartById(anId) {
    try {
      return await this.dao.getCartById(anId);
    } catch (error) {
      throw error;
    }
  }

  async addProduct(aProductID, aCartID) {
    try {
      await this.dao.addProduct(aProductID, aCartID);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductOn(aCartID, aProductID) {
    try {
      await this.dao.deleteProductOn(aCartID, aProductID);
    } catch (error) {
      throw error;
    }
  }

  async deleteAllProductsOn(aCartID) {
    try {
      await this.dao.deleteAllProductsOn(aCartID);
    } catch (error) {
      throw error;
    }
  }

  async updateCartWith(aCartID, potentialProducts) {
    try {
      await this.dao.updateCartWith(aCartID, potentialProducts);
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantityIn(aCartID, aProductID, potentialQuantity) {
    try {
      await this.dao.updateProductQuantityIn(
        aCartID,
        aProductID,
        potentialQuantity
      );
    } catch (error) {
      throw error;
    }
  }
}
