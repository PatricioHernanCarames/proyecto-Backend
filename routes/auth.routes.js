import { Router } from "express";
import { UserModel } from "../dao/models/userModel.js";

const router = Router();


router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      const newUser = await UserModel.create({ email, password });
      req.session.user = newUser.email;

      return res.redirect("/profile");
    }

    res.send(`Usuario ya registrado <a href="/login">Incia sesion</a>`);
  } catch (error) {
    console.log(error);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("La sesion no se pudo cerrar");
    res.redirect("/");
  });
});

export { router as AuthRouter };
