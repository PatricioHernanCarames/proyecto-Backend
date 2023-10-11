import path from "path";
import bcrypt from "bcrypt";
import {fileURLToPath} from 'url';
import  jwt  from "jsonwebtoken";

const PRIVATE_KEY= "CoderKeyQueFuncionaComoUnSecret";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export {__dirname}

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = (user)=>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'});
    res.json({accessToken: token})

}


export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ error: "not authenticated" });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        if(error)return res.status(403).send({error: "not authorized"})
        req.user=credentials.user;
    next()

    })
}