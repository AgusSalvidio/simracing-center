import { productService } from "../repositories/index.js";

class ProductViewController {
  constructor() {
    this.service = productService;
  }

  showProducts = async (req, res) => {
    try {
      const products = await this.service.getProducts();
      res.status(200).render("index", {
        title: "Productos",
        products: products,
        user: req.user,
        style: "index.css",
      });
    } catch (error) {
      return res.status(400).render("index", {
        title: "Productos",
        user: req.user,
        errorMessage: error.message,
        style: "index.css",
      });
    }
  };

  showRealTimeProducts = async (req, res) => {
    try {
      const products = await this.service.getProducts();
      res.status(200).render("realTimeProducts", {
        title: "Productos en tiempo real",
        user: req.user,
        products: products,
        style: "index.css",
      });
    } catch (error) {
      return res.status(400).render("index", {
        title: "Productos en tiempo real",
        user: req.user,
        errorMessage: error.message,
        style: "index.css",
      });
    }
  };

  showFilteredProducts = async (req, res) => {
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
        await this.service.getProductsFilteredBy(searchQuery, queryParams);

      const products = this.service.parseProducts(docs);

      res.status(200).render("products", {
        title: "Productos",
        products: products,
        user: req.user,
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
        user: req.user,
        errorMessage: error.message,
        style: "index.css",
      });
    }
  };

  showLogin = async (req, res) => {
    try {
      if (req.user) {
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
  };

  showRegister = async (req, res) => {
    try {
      if (req.user) {
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
  };
}

export default ProductViewController;
