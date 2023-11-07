import {Router} from "express";
import {UserManagerMongo} from "../daos/managers/mongo/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js";
import UserSignupDTO from '../daos/DTOs/user.dto.js';
import passport from "passport";
import {generateToken, authToken} from "../utils.js"
import userSignupController from "../controllers/user.controller.js";


const router = Router();
const userManager = new UserManagerMongo(UserModel);

let users =[];


router.post("/signup",userSignupController);

router.post("/login", passport.authenticate("loginStrategy", {
    failureRedirect: "/api/sessions/failure-login"
}), (req, res) => {
    const UserSignupDTO = new UserSignupDTO(req.user);
    res.json({ user: UserSignupDTO });
});




router.post("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.json({status:"error", message:"no se pudo cerrar la sesión"});
        res.json({status:"success", message:"sesion finalizada"});
    });
});

export { router as authRouter};