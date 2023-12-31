import express from "express";
import productRouter from "./routers/products.routers.js";
import productViewRouter from "./routers/productsView.routers.js";
import cartRouter from "./routers/carts.routers.js";
import __dirname from "../utils.js";
import handlebars from "express-handlebars";
import { readFileSync } from "node:fs";
import { Server as ServerIO } from "socket.io";

const app = express();
const PORT = process.env.PORT || 8080;
const URL = `http://localhost:${PORT}`;

const configureApp = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + "/public"));
  app.engine(
    "hbs",
    handlebars.engine({
      extname: ".hbs",
      helpers: {
        json: (anObject) => {
          /*When an array comes, the object is empty, so needs to be converted. -asalvidio*/
          if (anObject == "") {
            return [];
          } else {
            return JSON.stringify(anObject);
          }
        },
        headMeta: () => {
          return configureTemplateCustomHelperFor("headMeta");
        },
        scripts: () => {
          return configureTemplateCustomHelperFor("scripts");
        },
      },
    })
  );
  app.set("view engine", "hbs");
  app.set("views", __dirname + "/views");
};

const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const configureTemplateCustomHelperFor = (aTemplateName) => {
  const filePath = __dirname + `/views/${aTemplateName}.hbs`;
  const fileContent = readFileSync(filePath, "utf8");
  return fileContent;
};

const configureEndpoints = () => {
  app.use("/", productViewRouter);
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
};

const initializeApp = () => {
  configureApp();
  configureEndpoints();
};

initializeApp();

const io = new ServerIO(httpServer);

io.on("connection", (socket) => {
  console.log("Client connected!");
});

export { io };
