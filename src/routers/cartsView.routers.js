import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import CartViewController from "../controllers/cartsView.controller.js";
import { authorization } from "../middleware/authorization.middleware.js";

const router = Router();
const carViewController = new CartViewController();

router.get(
  "/:cid",
  passportCall("jwt"),
  authorization(["USER"]),
  carViewController.showCart
);

router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization(["USER"]),
  carViewController.completePurchase
);

export default router;
