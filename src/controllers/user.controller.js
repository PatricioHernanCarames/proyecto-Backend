import { UserModel } from "../daos/models/user.model.js";
import UserSignupDTO from "../daos/DTOs/user.dto.js";
import nodeMailing from "../config/nodeMailing.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

export const userSignupController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await hashPassword(password);
    // Crear una nueva instancia del DTO con los datos de la petición.
    const userSignupData = new UserSignupDTO({ email, password: hashedPassword });

    // Crear un nuevo documento de usuario con los datos del DTO.
    const newUser = new UserModel(userSignupData);
    newUser.confirmationToken = generateConfirmationToken();

    // Guardar el usuario en la base de datos.
    await newUser.save();

    const transporter = nodemailer.createTransport(nodemailerConfig);

    const confirmationLink = `http://localhost:${process.env.PORT}/confirm/${newUser.confirmationToken}`;

    const mailOptions = {
      from: "your-email@example.com",
      to: email,
      subject: "Confirm Your Email",
      html: `Click <a href="${confirmationLink}">here</a> to confirm your email.`,
    };

    await transporter.sendMail(mailOptions);

    // Devolver una respuesta exitosa al cliente.
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Manejar los errores que puedan surgir.
    if (error.code === 11000) {
      // Error de duplicado en MongoDB.
      res.status(409).json({ message: "Email already in use" });
    } else {
      // Otros errores no capturados.
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
  async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  function generateConfirmationToken() {
    const expirationTimeInMinutes = 60;
    const expirationTimestamp = Date.now() + expirationTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
    const token = crypto.randomBytes(20).toString("hex");
    return `${token}_${expirationTimestamp}`;
  }
};


/*export const userConfirmation=async (req, res) => {
    try {
      const { token } = req.params;
  
      // Find the user with the provided confirmation token
      const user = await userManager.getUserByConfirmationToken(token);
  
      // If the user is not found, or the email is already confirmed, handle accordingly
      if (!user || user.isConfirmed) {
        return res.status(400).json({ status: 'error', message: 'Invalid or expired confirmation token' });
      }
  
      // Mark the user as confirmed
      user.isConfirmed = true;
      user.confirmationToken = undefined;
  
      // Save the updated user to the database
      await userManager.updateUser(user);
  
      res.json({ status: 'success', message: 'Email confirmed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };*/

  export const userConfirmation = async (req, res) => {
    try {
      const tokenWithTimestamp = req.params.token;
      const [token, expirationTimestamp] = tokenWithTimestamp.split('_');
      const currentTimestamp = Date.now();
  
      // Check if the token is expired
      if (currentTimestamp > parseInt(expirationTimestamp, 10)) {
        // Token is expired, redirect to the registration page
        return res.redirect("/register");
      }
  
      // Continue with the confirmation logic
      const user = await UserModel.findOneAndUpdate(
        { confirmationToken: token },
        { $set: { isConfirmed: true }, $unset: { confirmationToken: 1 } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Handle successful confirmation, e.g., redirect to login page
      res.redirect("/login");
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  export const updateUserRoleController = async (req, res) => {
    try {
      const { uid } = req.params;
      const { newRole } = req.body;
  
      
      const currentUser = req.user;
  
      
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: 'Permission denied' });
      }
  
      // Cambiar el rol del usuario
      const updatedUser = await userManager.updateUserRole(uid, newRole);
  
      res.json({ status: 'success', result: updatedUser, message: 'User role updated' });
    } catch (error) {
      res.status(400).json({ status: 'error', error: error.message });
    }
  };



