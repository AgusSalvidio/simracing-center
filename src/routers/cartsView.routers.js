import { Router } from "express";
import { cartManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { auth } from "../middleware/authentication.middleware.js";

const router = Router();

router.get("/:cid", auth, async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = await cartManager.getCartById(cid);
    res.status(200).render("cart", {
      title: "Carrito",
      cartID: cid,
      products: products,
      style: "../../css/index.css",
    });
  } catch (error) {
    return res.status(400).render("cart", {
      title: "Carrito",
      errorMessage: error.message,
      style: "../../css/index.css",
    });
  }
});

export default router;
