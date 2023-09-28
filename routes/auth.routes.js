import { Router } from "express";
import { UserModel } from "../dao/models/userModel.js";
import bcrypt from "bcrypt";

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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).redirect("/profile")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("La sesion no se pudo cerrar");
    res.redirect("/");
  });
});

export { router as AuthRouter };
