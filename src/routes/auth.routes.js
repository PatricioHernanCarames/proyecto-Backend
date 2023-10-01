import { Router } from "express";
import { UserModel } from "../dao/models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken, isPasswordValid, createHash, validateToken } from "../utils.js";


const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      const hashedPassword = await createHash(password);
      console.log(hashedPassword);
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
      });
      req.session.user = newUser.email;

      return res.redirect("/profile");
    }

    res.send(`Usuario ya registrado <a href="/login">Incia sesion</a>`);
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Received email:", email);
  console.log("Received password:", password);

  try {
    const user = await UserModel.findOne({ email });
    console.log("User found in the database:", user);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
     
    }

    const isValid = isPasswordValid(password, user.password);
    console.log("Password comparison result:", isPasswordValid);

    if (!isValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Login successful");
    

    res.redirect("/profile");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout",(req,res)=>{
  req.session.destroy(error=>{
      if(error) return res.send("La sesion no se pudo cerrar");
      res.redirect("/login");
  });
});

export { router as AuthRouter };
