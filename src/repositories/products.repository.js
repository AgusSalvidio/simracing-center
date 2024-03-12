import { Product } from "../dto/Product/Product.js";

export default class ProductRepository {
  constructor(productDao) {
    this.dao = productDao;
  }

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
      this.dao.addProduct(product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      return await this.dao.getProducts();
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductsFilteredBy(searchQuery, queryParams) {
    try {
      return await this.dao.getProductsFilteredBy(searchQuery, queryParams);
    } catch (error) {
      console.error(error.message);
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
