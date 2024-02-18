import { Router } from "express";
import productRouter from "./routers/products.routers.js";
import productViewRouter from "./routers/productsView.routers.js";
import cartViewRouter from "./routers/cartsView.routers.js";
import cartRouter from "./routers/carts.routers.js";
import chatRouter from "./routers/chatView.routers.js";
import authRouter from "./routers/auth.routers.js";

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
