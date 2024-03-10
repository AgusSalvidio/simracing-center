import { mongoose } from "mongoose";
import { Product } from "../../../main/Product/Product.js";
import productModel from "../../DBBasedManagers/models/product.model.js";

export class ProductManagerDBBased {
  assertSatisfiesAllRequiredParameters = ({
    title,
    description,
    price,
    code,
    stock,
    category,
  }) => {
    if (!title || !description || !price || !code || !stock || !category)
      throw new Error("Faltan parámetros");
  };

  async assertProductCodeIsNotAlreadyStored(aCodeId) {
    try {
      const sameCodeId = (product) => product.code === aCodeId;
      const products = await this.getProducts();
      if (products.some(sameCodeId))
        throw new Error(`Ya existe un producto con el código ${aCodeId}`);
    } catch (error) {
      throw error;
    }
  }

  async initializeProductUsing({
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      return new Product({
        id: null,
        title,
        description,
        price,
        code,
        stock,
        status: true,
        category,
        thumbnails,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addProduct(aPotentialProduct) {
    try {
      this.assertSatisfiesAllRequiredParameters(aPotentialProduct);
      await this.assertProductCodeIsNotAlreadyStored(aPotentialProduct.code);

      const product = await this.initializeProductUsing(aPotentialProduct);

      productModel.create(product);
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
}
