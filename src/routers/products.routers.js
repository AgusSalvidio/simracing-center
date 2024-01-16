import { Router } from "express";
import { uploader } from "../../utils.js";
import { io } from "../app.js";
import { productManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (!limit) {
      return res.status(200).send(products);
    } else {
      const filteredProducts = products.slice(0, limit);
      return res.status(200).send(filteredProducts);
    }
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const foundProduct = await productManager.getProductById(pid);
    return res.status(200).send(foundProduct);
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
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
      description: "Se agregó correctamente el producto",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
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
      description: `Se eliminó correctamente el product con ID ${pid}`,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const potentialProduct = req.body;
    await productManager.updateProduct(pid, potentialProduct);
    return res.status(200).send({
      status: "success",
      description: `Se actualizó correctamente el producto con ID ${pid}`,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

export default router;
