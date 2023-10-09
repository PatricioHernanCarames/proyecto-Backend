import path from "path" ;
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
const __filename =path.dirname(fileURLToPath( import.meta.url ));

export {__filename};

export const createHash= (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (password, user)=>{
    return  bcrypt.compareSync( password ,user.password);
};