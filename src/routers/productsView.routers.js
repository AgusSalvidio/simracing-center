import { Router } from "express";
import { productManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).render("index", {
      title: "Productos",
      products: products,
      style: "index.css",
    });
  } catch (error) {
    return res
      .status(400)
      .render("index", {
        title: "Productos",
        errorMessage: error.message,
        style: "index.css",
      });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).render("realTimeProducts", {
      title: "Productos en tiempo real",
      products: products,
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("index", {
      title: "Productos en tiempo real",
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

export default router;
