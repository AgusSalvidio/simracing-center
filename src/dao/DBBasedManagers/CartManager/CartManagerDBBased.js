import { Cart } from "../../../dto/Cart/Cart.js";
import cartModel from "../../DBBasedManagers/models/cart.model.js";
import { mongoose } from "mongoose";
import { productService } from "../../../repositories/index.js";
import CustomError from "../../../../utils/errors/CustomError.js";
import {
  generateObjectNotIncludedErrorInfo,
  generateInvalidTypeErrorInfo,
  generateCartErrorInfo,
} from "../../../../utils/errors/info.js";
import { EErrors } from "../../../../utils/errors/enums.js";

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
      throw error;
    }
  }

  async getCarts() {
    try {
      return await cartModel.find({});
    } catch (error) {
      throw error;
    }
  }

  async assertHasCarts() {
    try {
      const carts = await cartModel.findOne({});
      if (!carts)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: "No hay carritos",
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
    } catch (error) {
      throw error;
    }
  }

  assertCartIdIsValid(anId) {
    if (!mongoose.Types.ObjectId.isValid(anId))
      CustomError.createError({
        name: "Invalid type error",
        cause: generateInvalidTypeErrorInfo(),
        message: `El formato del ID ${anId} no cumple con el formato de UUID`,
        code: EErrors.INVALID_TYPE_ERROR,
      });
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
      if (!cart)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `No se encuentra el carrito con ID ${anId}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  assertSatisfiesAllProductRequiredParameters = (productID) => {
    if (!productID)
      CustomError.createError({
        name: "Product adding failed",
        cause: generateCartErrorInfo(),
        message: "Error al agregar el producto al carrito",
        code: EErrors.INSTANCE_CREATION_FAILED,
      });
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
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `El carrito con ID ${aCartID} no tiene el producto con ID ${aProductID}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async assertCartExists(aCartID) {
    try {
      const cart = await cartModel.findById({ _id: aCartID });
      if (!cart)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `No se encuentra el carrito con ID ${aCartID}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
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
          CustomError.createError({
            name: "Transaction failed",
            message: "Hubo un error al borrar el producto",
            code: EErrors.TRANSACTION_FAILED,
          });
        }
      } else {
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `El carrito con ID ${aCartID} no tiene el producto con ID ${aProductID}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
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
        CustomError.createError({
          name: "Transaction failed",
          message: "Hubo un error al borrar los productos",
          code: EErrors.TRANSACTION_FAILED,
        });
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
        CustomError.createError({
          name: "Transaction failed",
          message: "Hubo un error al actualizar el carrito",
          code: EErrors.TRANSACTION_FAILED,
        });
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
          CustomError.createError({
            name: "Transaction failed",
            message: "Hubo un error al actualizar la cantidad del producto",
            code: EErrors.TRANSACTION_FAILED,
          });
        }
      } else {
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `El carrito con ID ${aCartID} no tiene el producto con ID ${aProductID}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
