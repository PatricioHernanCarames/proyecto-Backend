import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoStore from "connect-mongo";
import path from "path";
import {Sever} from "socket.io";
import passport from "passport"




import {options} from "./config/options.js";
import { __dirname } from "./utils.js";
import {productsRouter} from "./routes/products.routes.js";
import {cartRouter} from "./routes/cart.routes.js";
import { WebRouter } from "./routes/web.routes.js";
import "./config/dbConnection.js";
import {chatManagerMongo} from "./dao/managers/chatManagerMongo.js";
import {chatModel} from "dao/managers/chat.model.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { initializedPassport } from "./config/config.passport.js";
import { Server } from "http";


const chatManager = new chatManagerMongo(ChatModel);

export const PORT =8080;

const app= express();

const httpServer = app.listen(PORT, ()=>{console.log(`server listening on pport ${PORT}`)});

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

httpServer.on("error", (error)=>console.log(`error in server ${error}`));

app.use(session({
    store:mongoStore.create({
        mongoUrl: options.mongoDB.url
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized :false  
}));

initializedPassport();
app.use(passport.initialize());
app.use(passport.session());


app.engine(".hbs", handlebars.engine({extname: '.hbs'}));
app.set('views', path.join(__dirname, "/views"));
app.set('view engine', ".hbs");

app.use(webRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sessions", AuthRouter);

socketServer.on("connection", async(socketConnected)=>{
    console.log(`Nuevo clienete conectado ${socketConnected.id}`);
    const messages = await chatManager.getMessages();
    socketServer.emit("msgHistory", messages);
    socketConnected.on("message", async (data)=>{

        await chatManager.addMessages(data);
        const messages = await chatManager.getMessages();
        socketServer.emit("msgHistory", messages);    
    });
});

