import { Product } from "../dto/Product/Product.js";
import CustomError from "../../utils/errors/CustomError.js";
import {
  generateProductErrorInfo,
  generateObjectAlreadyIncludedErrorInfo,
} from "../../utils/errors/info.js";
import { EErrors } from "../../utils/errors/enums.js";

export default class ProductRepository {
  constructor(productDao) {
    this.dao = productDao;
  }

  assertSatisfiesAllRequiredParameters = (aPotentialProduct) => {
    const { title, description, price, code, stock, category } =
      aPotentialProduct;

    if (!title || !description || !price || !code || !stock || !category)
      CustomError.createError({
        name: "Product creation failed",
        cause: generateProductErrorInfo(aPotentialProduct),
        message: "Error creating the product",
        code: EErrors.INSTANCE_CREATION_FAILED,
      });
  };

  async assertProductCodeIsNotAlreadyStored(aCodeId) {
    try {
      const sameCodeId = (product) => product.code === aCodeId;
      const products = await this.getProducts();
      if (products.some(sameCodeId))
        CustomError.createError({
          name: "Object already included",
          cause: generateObjectAlreadyIncludedErrorInfo(aCodeId),
          message: `Ya existe un producto con el código ${aCodeId}`,
          code: EErrors.OBJECT_ALREADY_INCLUDED,
        });
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
      throw error;
    }
  }

  async addProduct(aPotentialProduct) {
    try {
      this.assertSatisfiesAllRequiredParameters(aPotentialProduct);
      await this.assertProductCodeIsNotAlreadyStored(aPotentialProduct.code);

      const product = await this.initializeProductUsing(aPotentialProduct);
      this.dao.addProduct(product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      return await this.dao.getProducts();
    } catch (error) {
      throw error;
    }
  }

  async getProductsFilteredBy(searchQuery, queryParams) {
    try {
      return await this.dao.getProductsFilteredBy(searchQuery, queryParams);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(anId) {
    try {
      return await this.dao.getProductById(anId);
    } catch (error) {
      throw error;
    }
  }

  parseProducts(potentialProducts) {
    return this.dao.parseProducts(potentialProducts);
  }

  async deleteProduct(anId) {
    try {
      await this.dao.deleteProduct(anId);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(anOriginalProductId, anUpdatedProduct) {
    try {
      await this.dao.updateProduct(anOriginalProductId, anUpdatedProduct);
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateProductStock(aProductID, anUpdatedStock) {
    await this.dao.updateProductStock(aProductID, anUpdatedStock);
  }
}
