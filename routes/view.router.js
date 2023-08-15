import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/chat",(req,res)=>{
  res.render("chat");
})

router.get("/load",(req,res)=>{
  res.render("realTimeProducts");
})

export default router;
