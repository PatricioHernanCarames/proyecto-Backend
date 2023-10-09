import { Router } from "express";
import { userManagerMongo } from "../dao/managers/userManagerMongo.js";
import { UserModel } from "../dao/models/userModel.js";
import passport from "passport";

const router = Router();
const userManager = new userManagerMongo(UserModel);

router.post(
  "/signup",
  passport.authenticate("signupStrategy", {
    failureRedirect: "/api/sessions/failure-signup",
  }),
  (req, res) => {
    res.redirect("/products");
  }
);

router.get("failure-signup", (req,res)=>{
    res.send(`<div>Error al registrar el usuario, <a href="/login">Intente de nuevo</a></div>`)
});

router.post("/login", passport.authenticate("loginStrategy", {
    failureRedirect:"/api/sessions/failure-login",

}),(req,res)=>{
    res.redirect("/products");
});

router.get("/failure-login",(req,res)=>{
    res.send("<div style='color:#f00'>Usuario o contraseña incorrectos, <a href=`/login`>Intente de nuevo</a></div>");
});

router.post("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.json({status: "error ", message:"no se pudo cerrar la sesión"});
        res.json({status:"success", message:"sesión finalizada"});
    });
});

export {router as AuthRouter}

