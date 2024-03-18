import { io } from "../app.js";
import { productService } from "../repositories/index.js";

class ProductController {
  constructor() {
    this.service = productService;
  }
  getProducts = async (req, res) => {
    try {
      const {
        limit: limitQuery = 10,
        page: pageQuery = 1,
        sort: sortQuery,
        query,
      } = req.query;

      const queryParams = {
        limit: parseInt(limitQuery),
        page: parseInt(pageQuery),
        lean: true,
        ...(sortQuery && { sort: { price: sortQuery } }),
      };

      let searchQuery = {};

      if (query) {
        const [field, value] = query.split(":");
        if (field && value) {
          searchQuery = { [field]: value };
        }
      }
      const {
        docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      } = await this.service.getProductsFilteredBy(searchQuery, queryParams);
      return res.status(200).send({
        status: "success",
        payload: this.service.parseProducts(docs),
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
  getProductByID = async (req, res) => {
    try {
      const { pid } = req.params;
      const foundProduct = await this.service.getProductById(pid);
      return res.status(200).send(foundProduct);
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
  addProduct = async (req, res, next) => {
    try {
      const potentialProduct = req.body;
      if (req.files && req.files.length > 0) {
        const images = req.files.map((file) => {
          const fullPath = file.path;
          const imagesIndex = fullPath.indexOf("images");
          if (imagesIndex !== -1) {
            const relativePath = fullPath.substring(imagesIndex - 1);
            return relativePath;
          } else {
            console.log("Images directory not found");
            return null;
          }
        });

        potentialProduct.thumbnails = images.filter((image) => image !== null);
      }

      await this.service.addProduct(potentialProduct);

      const updatedProducts = await this.service.getProducts();

      io.emit("updateProductTableEvent", updatedProducts);

      return res.status(201).send({
        status: "success",
        payload: "Se agregó correctamente el producto",
      });
    } catch (error) {
      next(error);
    }
  };
  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      await this.service.deleteProduct(pid);

      const updatedProducts = await this.service.getProducts();

      io.emit("updateProductTableEvent", updatedProducts);

      return res.status(200).send({
        status: "success",
        payload: `Se eliminó correctamente el producto con ID ${pid}`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
  updateProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const potentialProduct = req.body;
      await this.service.updateProduct(pid, potentialProduct);
      return res.status(200).send({
        status: "success",
        payload: `Se actualizó correctamente el producto con ID ${pid}`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
}

export default ProductController;
