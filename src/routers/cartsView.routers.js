import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import CartViewController from "../controllers/cartsView.controller.js";

const router = Router();
const carViewController = new CartViewController();

router.get("/:cid", passportCall("jwt"), carViewController.showCart);

export default router;
