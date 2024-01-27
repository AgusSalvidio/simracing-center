import { Router } from "express";
import { uploader } from "../../utils.js";
import { io } from "../app.js";
import { productManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

const router = Router();

router.get("/", async (req, res) => {
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
    } = await productManager.getProductsFilteredBy(searchQuery, queryParams);
    return res.status(200).send({
      status: "success",
      payload: productManager.parseProducts(docs),
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
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const foundProduct = await productManager.getProductById(pid);
    return res.status(200).send(foundProduct);
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.post("/", uploader.array("thumbnails"), async (req, res) => {
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

    await productManager.addProduct(potentialProduct);

    const updatedProducts = await productManager.getProducts();

    io.emit("updateProductTableEvent", updatedProducts);

    return res.status(201).send({
      status: "success",
      payload: "Se agregó correctamente el producto",
    });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);

    const updatedProducts = await productManager.getProducts();

    io.emit("updateProductTableEvent", updatedProducts);

    return res.status(200).send({
      status: "success",
      payload: `Se eliminó correctamente el producto con ID ${pid}`,
    });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const potentialProduct = req.body;
    await productManager.updateProduct(pid, potentialProduct);
    return res.status(200).send({
      status: "success",
      payload: `Se actualizó correctamente el producto con ID ${pid}`,
    });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

export default router;
