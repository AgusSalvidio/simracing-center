import { Router } from "express";
import { cartManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    await cartManager.addCart();
    return res.status(201).send({
      status: "success",
      payload: "Se agregó correctamente el carrito",
    });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.addProduct(pid, cid);
    return res.status(201).send({
      status: "success",
      payload: "Se agregó correctamente el producto al carrito",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ status: "failed", description: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const foundCart = await cartManager.getCartById(cid);
    return res.status(200).send(foundCart.products);
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.deleteProductOn(cid, pid);
    return res.status(200).send({
      status: "success",
      payload: `Se eliminó correctamente el producto con ID ${pid} del carrito con ID ${cid}`,
    });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.deleteAllProductsOn(cid);
    return res.status(200).send({
      status: "success",
      payload: `Se eliminaron todos los productos correctamente del carrito con ID ${cid}`,
    });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

export default router;
