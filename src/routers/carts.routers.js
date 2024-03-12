import { Router } from "express";
import CartController from "../controllers/carts.controller.js";

const router = Router();
const cartController = new CartController();

router.get("/:cid", cartController.getCartByID);

router.post("/", cartController.addCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.post("/:cid/purchase", cartController.completePurchase);

router.put("/:cid", cartController.updateCartWith);
router.put("/:cid/products/:pid", cartController.updateProductsQuantity);

router.delete("/:cid/products/:pid", cartController.deleteProduct);
router.delete("/:cid", cartController.deleteAllProducts);

export default router;
