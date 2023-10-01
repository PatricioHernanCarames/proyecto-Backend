import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

const dbString =
  "mongodb+srv://PatricioHCarames:Back1234@backende-commerce.8rpdxkg.mongodb.net/Products";

export const Connection = mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("connected to MongoDB");
  });

export const Session = session({
  store: MongoStore.create({
    mongoUrl: dbString,
    ttl: 180,
  }),
  secret: "claveSecreta",
  resave: true,
  saveUninitialized: true,
});
