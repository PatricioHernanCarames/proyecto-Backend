export default class CustomError{
    static createError({name="Error",cause, message, code=1}){
        let error = new Error(message);
        Object.assign(error, { name: name , cause : cause});
        throw error;
    }
}