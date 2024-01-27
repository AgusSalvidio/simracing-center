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
    return res.status(400).render("index", {
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

router.get("/products", async (req, res) => {
  try {
    const {
      limit: limitQuery = 12,
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

    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
      await productManager.getProductsFilteredBy(searchQuery, queryParams);

    const products = productManager.parseProducts(docs);

    res.status(200).render("products", {
      title: "Productos",
      products: products,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page,
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("products", {
      title: "Productos",
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

export default router;
