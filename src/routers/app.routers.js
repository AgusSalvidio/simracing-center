import { Router } from "express";
import productRouter from "./products.routers.js";
import productViewRouter from "./productsView.routers.js";
import cartViewRouter from "./cartsView.routers.js";
import cartRouter from "./carts.routers.js";
import chatRouter from "./chatView.routers.js";
import authRouter from "./auth.routers.js";

const router = Router();

router.use("/", productViewRouter);
router.use("/carts", cartViewRouter);
router.use("/api/auth", authRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/chat", chatRouter);
router.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

export default router;
