import express from "express";
import productRouter from "./routers/products.routers.js";
import productViewRouter from "./routers/productsView.routers.js";
import cartViewRouter from "./routers/cartsView.routers.js";
import cartRouter from "./routers/carts.routers.js";
import chatRouter from "./routers/chatView.routers.js";
import authRouter from "./routers/auth.routers.js";
import __dirname from "../utils.js";
import handlebars from "express-handlebars";
import { readFileSync } from "node:fs";
import { Server as ServerIO } from "socket.io";
import { connectDB, DB_URI } from "./config/config.js";
import messageModel from "./dao/models/message.model.js";
import { messageManager } from "./dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import flash from "express-flash";

const app = express();
const PORT = process.env.PORT || 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("ultraSecretCookieSign"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 1500,
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
      formatDate: (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleString();
      },
      shouldRenderNavbar: (routeName) => {
        const restrictedRoutes = ["Inicio de Sesión", "Registrate"];
        return !restrictedRoutes.includes(routeName);
      },
      navBar: () => {
        return configureTemplateCustomHelperFor("navBar");
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

app.use("/", productViewRouter);
app.use("/carts", cartViewRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const configureTemplateCustomHelperFor = (aTemplateName) => {
  const filePath = __dirname + `/views/${aTemplateName}.hbs`;
  const fileContent = readFileSync(filePath, "utf8");
  return fileContent;
};

const io = new ServerIO(httpServer);

io.on("connection", (socket) => {
  console.log("Client connected!");

  socket.on("addMessageEvent", async (data) => {
    messageModel.create(data);

    const messages = await messageManager.getMessagesSortedByTimestamp();

    io.emit("updateMessagesBoxEvent", messages);
  });
});

export { io };
