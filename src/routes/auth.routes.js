import {Router} from "express";
import {UserManagerMongo} from "../daos/managers/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js";
import passport from "passport";
import {generateToken, authToken} from "../utils.js"


const router = Router();
const userManager = new UserManagerMongo(UserModel);

let users =[];

router.post("/signup",(req,res)=>{
  const {name,email, password} = req.body;
  const user = users.find(u=>u.email === email);
  if(user){
      return res.json({message:"El usuario ya esta registrado"});
  }
  users.push(req.body);
  //generamos el token
  const accessToken = generateToken({name,email});
  res.json({accessToken});
})


router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/failure-login"
}), (req,res)=>{
    res.redirect("/products");
});



router.post("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.json({status:"error", message:"no se pudo cerrar la sesión"});
        res.json({status:"success", message:"sesion finalizada"});
    });
});

export { router as authRouter};