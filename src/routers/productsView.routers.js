import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import ProductViewController from "../controllers/productsView.controller.js";

const router = Router();
const productViewController = new ProductViewController();

router.get("/", passportCall("jwt"), productViewController.showProducts);
router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  productViewController.showRealTimeProducts
);
router.get(
  "/products",
  passportCall("jwt"),
  productViewController.showFilteredProducts
);

router.get("/login", productViewController.showLogin);
router.get("/register", productViewController.showRegister);

export default router;
