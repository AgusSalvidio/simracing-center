import express from "express";
import productRouter from "./routers/products.routers.js";

const app = express();
const PORT = 8080;

const configureApp = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

const configureEndpoints = () => {
  app.use("/api/products", productRouter);
};

const initializeApp = () => {
  configureApp();
  configureEndpoints();
};

initializeApp();
