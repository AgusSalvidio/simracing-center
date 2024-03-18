import { Router } from "express";
import productRouter from "./products.routers.js";
import productViewRouter from "./productsView.routers.js";
import cartViewRouter from "./cartsView.routers.js";
import cartRouter from "./carts.routers.js";
import chatRouter from "./chatView.routers.js";
import authRouter from "./auth.routers.js";
import emailRouter from "./email.routers.js";
import smsRouter from "./sms.routers.js";
import mockRouter from "./mock.routers.js";

const router = Router();

router.use("/", productViewRouter);
router.use("/carts", cartViewRouter);
router.use("/api/auth", authRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/chat", chatRouter);
router.use("/email", emailRouter);
router.use("/sms", smsRouter);
router.use("/test", mockRouter);
router.use("/mockingproducts", mockRouter);
router.get("*", (req, res) => {
  return res.status(404).render("authFail", {
    title: "Error",
    errorMessage: {
      status: "error",
      payload: "Página no encontrada",
    },
    style: "index.css",
  });
});

export default router;
