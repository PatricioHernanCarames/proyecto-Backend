import {Router} from "express";
import passport from "passport";
import {userSignupController, userConfirmation, updateUserRoleController} from "../controllers/user.controller.js";



const router = Router();


let users =[];


router.post("/signup",userSignupController);

router.get('confirm/:token',userConfirmation, )

router.put("/users/premium/:uid", updateUserRoleController);

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