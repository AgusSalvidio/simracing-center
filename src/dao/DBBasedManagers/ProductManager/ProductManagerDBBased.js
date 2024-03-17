import { mongoose } from "mongoose";
import { Product } from "../../../dto/Product/Product.js";
import productModel from "../../DBBasedManagers/models/product.model.js";

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
      console.error(error.message);
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
      console.error(error.message);
    }
  }

  async assertHasProducts() {
    try {
      const products = await productModel.findOne({});
      if (!products) throw new Error("No hay productos");
    } catch (error) {
      throw error;
    }
  }

  assertProductIdIsValid(anId) {
    if (!mongoose.Types.ObjectId.isValid(anId))
      throw new Error(
        `El formato del ID ${anId} no cumple con el formato de UUID`
      );
  }

  async getProductById(anId) {
    try {
      await this.assertHasProducts();
      this.assertProductIdIsValid(anId);
      const product = await productModel.findById(anId);
      if (!product)
        throw new Error(`No se encuentra el producto con ID ${anId}`);
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
        throw new Error(`No se encontró ningún producto con el ID ${anId}`);
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
      console.error(error.message);
    }
  }

  async updateProductStock(aProductID, anUpdatedStock) {
    await productModel.updateOne(
      { _id: aProductID },
      { $set: { stock: anUpdatedStock } }
    );
  }
}
