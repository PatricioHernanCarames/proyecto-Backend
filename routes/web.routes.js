import {Router} from "express";

const router = Router();


router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/signup",(req,res)=>{
    res.render("registro");
});

router.get("/profile",(req,res)=>{
    console.log(req.session);
    res.render("perfil");
});

export {router as WebRouter};