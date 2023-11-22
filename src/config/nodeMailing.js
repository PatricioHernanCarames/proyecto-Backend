import dotenv from "dotenv"

dotenv.config();

export default {
    service:'gmail',
    auth:{
        user:process.env.USER_MAILER,
        pass:process.env.PASSWORD_MAILER,

    }
}