import { Router } from "express";
import { productManager } from "../main/ManagerSystem/ManagerSystem.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).render("index", {
      title: "Productos",
      products: products,
    });
  } catch (error) {
    return res
      .status(400)
      .render("index", { title: "Productos", errorMessage: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).render("realTimeProducts", {
      title: "Productos en tiempo real",
      products: products,
    });
  } catch (error) {
    return res.status(400).render("index", {
      title: "Productos en tiempo real",
      errorMessage: error.message,
    });
  }
});

export default router;
