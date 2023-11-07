import {userDAO} from "../dao/index.js";

export const saveUser=(req, res) => {
    const { name, email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        return res.json({ message: "El usuario ya está registrado" });
    }
    users.push(req.body);
    // Generamos el token
    const accessToken = generateToken({ name, email });
    const userDTO = new UserDTO(req.body);
    res.json({ accessToken, user: userDTO });
  }