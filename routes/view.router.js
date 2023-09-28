import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/chat",(req,res)=>{
  res.render("chat");
})

router.get("/login",(req,res)=>{
  res.render("login");
});

router.get("/signup",(req,res)=>{
  res.render("registro");
});

router.get("/profile",(req,res)=>{

  const {user} = req.user;
  res.render("profile", {user})
  
});

export default router;
