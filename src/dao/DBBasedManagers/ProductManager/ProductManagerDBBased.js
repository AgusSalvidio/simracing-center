import { mongoose } from "mongoose";
import { Product } from "../../../dto/Product/Product.js";
import productModel from "../../DBBasedManagers/models/product.model.js";
import CustomError from "../../../../utils/errors/CustomError.js";
import {
  generateObjectNotIncludedErrorInfo,
  generateInvalidTypeErrorInfo,
} from "../../../../utils/errors/info.js";
import { EErrors } from "../../../../utils/errors/enums.js";

export class ProductManagerDBBased {
  async addProduct(aProduct) {
    try {
      productModel.create(aProduct);
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      const potentialProducts = await productModel.find({});
      const parsedProducts = potentialProducts.map(
        (potentialProduct) => new Product(potentialProduct)
      );
      return parsedProducts;
    } catch (error) {
      throw error;
    }
  }

  parseProducts(potentialProducts) {
    const parsedProducts = potentialProducts.map(
      (potentialProduct) => new Product(potentialProduct)
    );
    return parsedProducts;
  }

  async getProductsFilteredBy(searchQuery, queryParams) {
    try {
      const potentialProducts = await productModel.paginate(
        searchQuery,
        queryParams
      );
      return potentialProducts;
    } catch (error) {
      throw error;
    }
  }

  async assertHasProducts() {
    try {
      const products = await productModel.findOne({});
      if (!products)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: "No hay productos",
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
    } catch (error) {
      throw error;
    }
  }

  assertProductIdIsValid(anId) {
    if (!mongoose.Types.ObjectId.isValid(anId))
      CustomError.createError({
        name: "Invalid type error",
        cause: generateInvalidTypeErrorInfo(),
        message: `El formato del ID ${anId} no cumple con el formato de UUID`,
        code: EErrors.INVALID_TYPE_ERROR,
      });
  }

  async getProductById(anId) {
    try {
      await this.assertHasProducts();
      this.assertProductIdIsValid(anId);
      const product = await productModel.findById(anId);
      if (!product)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `No se encuentra el producto con ID ${anId}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(anId) {
    try {
      const productToDelete = await this.getProductById(anId);
      const result = await productModel.deleteOne({ _id: productToDelete.id });
      if (!result.deletedCount > 0) {
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `No se encontró ningún producto con el ID ${anId}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(anOriginalProductId, anUpdatedProduct) {
    try {
      await productModel.findByIdAndUpdate(
        { _id: anOriginalProductId },
        anUpdatedProduct
      );
    } catch (error) {
      throw error;
    }
  }

  async updateProductStock(aProductID, anUpdatedStock) {
    await productModel.updateOne(
      { _id: aProductID },
      { $set: { stock: anUpdatedStock } }
    );
  }
}
