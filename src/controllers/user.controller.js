
import { UserModel } from '../daos/models/user.model.js'; 
import  UserSignupDTO  from '../daos/DTOs/user.dto.js'; 

const userSignupController = async (req, res) => {
    try {
        // Crear una nueva instancia del DTO con los datos de la petición.
        const userSignupData = new UserSignupDTO(req.body);

        // Crear un nuevo documento de usuario con los datos del DTO.
        const newUser = new UserModel(userSignupData);

        // Guardar el usuario en la base de datos.
        await newUser.save();

        // Devolver una respuesta exitosa al cliente.
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Manejar los errores que puedan surgir.
        if (error.code === 11000) {
            // Error de duplicado en MongoDB.
            res.status(409).json({ message: 'Email already in use' });
        } else {
            // Otros errores no capturados.
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
};

export default userSignupController;
