import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import passport from "passport";
import dotenv from "dotenv";
import "dotenv/config";
import minimist from "minimist";

import { __dirname } from "./utils.js";
import { productsRouter } from "./routes/products.routes.js";
import { sessionRouter } from "../src/routes/session.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { webRouter } from "./routes/web.routes.js";
import  {testLogger}  from "./routes/logger.routes.js";
import "./config/dbConnection.js";
import { Server } from "socket.io";
import { chatManagerMongo } from "./daos/managers/mongo/chatManagerMongo.js";
import { ChatModel } from "./daos/models/chat.model.js";
import { authRouter } from "./routes/auth.routes.js";
import { initializePassport } from "./config/passport.config.js";
import errorHandler from "./middlewares/errors/index.js";
import { logger } from "./utils/logger.js";

dotenv.config({ path: "./process.env" }); // Assuming your .env file is at the root of your project

//para seleccionar el modo de persistencia escribir en linea de comandos:
//node app.js --persistence MONGO
//node app.js --persistence MEMORY

const args = minimist(process.argv.slice(2));
const config = { persistence: args.persistence }; // Obtener la opción de persistencia de los argumentos

if (!config.persistence) {
  console.error(
    "Debes especificar una opción de persistencia (--persistence MONGO o --persistence MEMORY)"
  );
  process.exit(1);
}

//service
const chatManager = new chatManagerMongo(ChatModel);
// Ejecucion del servidor
export const PORT = process.env.PORT;
console.log("Port:", process.env.PORT);
console.log("Database URL:", process.env.DATABASE_URL);

const claveSecreta = process.env.PRIVATE_KEY;

const app = express();
const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

//adicional creamos un servidor para websocket.
const socketServer = new Server(httpServer);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(errorHandler);
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

httpServer.on("error", (error) => console.log(`Error in server ${error}`));

//configuracion session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
    }),
    secret: claveSecreta,
    resave: false,
    saveUninitialized: false, //para que no se guarde el estado de la sesión si no hay ninguna acción en é
  })
);

//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//configuracion motor de plantillas
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", ".hbs");

//routes
app.use(webRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);
app.use("/api", sessionRouter);
app.use("api/test", testLogger)

////configuración socket servidor
// const messages=[];
socketServer.on("connection", async (socketConnected) => {
    try {
        console.log(`Nuevo cliente conectado ${socketConnected.id}`);
        const messages = await chatManager.getMessages();
        socketServer.emit("msgHistory", messages);

        socketConnected.on("message", async (data) => {
            await chatManager.addMessage(data);
            const messages = await chatManager.getMessages();
            socketServer.emit("msgHistory", messages);
        });
    } catch (error) {
        console.error("WebSocket connection error:", error);
    }
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    
});
