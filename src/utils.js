import path from "path";
import bcrypt from "bcrypt";
import {fileURLToPath} from 'url';
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config({ path: './process.env' });

const privateKey= process.env.PRIVATE_KEY;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export {__dirname}

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = (payload)=>{
    const token = process.env.PRIVATE_KEY;
    console.log({accessToken: token})
    if(!token){
        throw new Error('secret key is missing')
    }

   return jwt.sign(payload, token, {expiresIn:'1h'});

}


export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ error: "not authenticated" });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token,privateKey,(error,credentials)=>{
        if(error)return res.status(403).send({error: "not authorized"})
        req.user=credentials.user;
    next()

    })
}