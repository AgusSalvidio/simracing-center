import { Router } from "express";
import { productManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { auth } from "../middleware/authentication.middleware.js";
import { passportCall } from "../middleware/passportCall.js";

const router = Router();

router.get("/", passportCall("jwt"), async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).render("index", {
      title: "Productos",
      products: products,
      session: req.session?.user,
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("index", {
      title: "Productos",
      session: req.session?.user,
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

router.get("/realtimeproducts", passportCall("jwt"), async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).render("realTimeProducts", {
      title: "Productos en tiempo real",
      session: req.session?.user,
      products: products,
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("index", {
      title: "Productos en tiempo real",
      session: req.session?.user,
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

router.get("/products", passportCall("jwt"), async (req, res) => {
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
      user: req.session?.user,
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
      user: req.session?.user,
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

router.get("/login", async (req, res) => {
  try {
    if (req.session?.user) {
      return res.redirect("/products");
    }
    return res.status(200).render("login", {
      title: "Inicio de Sesión",
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("login", {
      title: "Inicio de Sesión",
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

router.get("/register", async (req, res) => {
  try {
    if (req.session?.user) {
      res.redirect(200, "/products");
    }
    return res.status(200).render("register", {
      title: "Registrate",
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("register", {
      title: "Registrate",
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

export default router;
