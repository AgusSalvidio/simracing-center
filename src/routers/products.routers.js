import { Router } from "express";
import { productManager } from "../main/ManagerSystem/ManagerSystem.js";
import { uploader } from "../../utils.js";

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
    const foundProduct = await productManager.getProductById(parseInt(pid));
    return res.status(200).send(foundProduct);
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

router.post("/", uploader.single("thumbnails"), async (req, res) => {
  try {
    const potentialProduct = req.body;
    if (req.file) {
      /*Adapt filepath to relative path and not the absolute path, 
      to avoid errors when loading. -asalvidio*/
      const fullPath = req.file.path;
      const imagesIndex = fullPath.indexOf("images");
      if (imagesIndex !== -1) {
        const relativePath = fullPath.substring(imagesIndex - 1); // The -1 is to delete the / before images -asalvidio
        potentialProduct.thumbnail = relativePath;
      } else {
        console.log("Images directory not found");
      }
    }

    await productManager.addProduct(potentialProduct);
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
    await productManager.deleteProduct(parseInt(pid));
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
    await productManager.updateProduct(parseInt(pid), potentialProduct);
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
