import passport from "passport";
import LocalStrategy  from "passport-local";
import GitHubStrategy from "passport-github2"
import { UserModel } from "../daos/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";


import dotenv from 'dotenv';

dotenv.config({ path: './process.env' })



export const initializePassport = ()=>{

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, data, done) => {
        try {
            console.log(data);
            let user = await UserModel.findOne({ email: data._json.email });
            if (!user) {
                let newUser = new UserSignupDTO(data);
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
    
    passport.use("signupStrategy", new LocalStrategy(
        {
            usernameField:"email",
            passReqToCallback:true
        },
        async(req,username,password,done)=>{
            try {
                const {name} = req.body;
                const user = await UserModel.findOne({email:username});
                if(user){
                    return done(null,false)
                }
                
                let role='user';
                if (username.endsWith("@coder.com")) {
                    role = "admin";
                }
                
                const newUser = {
                    name,
                    email:username,
                    password:createHash(password),
                    role
                };
                const userCreated = await UserModel.create(newUser);
                return done(null,userCreated)
            } catch (error) {
                return done(error);
            }
        }
    ));

    //estrategia de login con passport-local
    passport.use("loginStrategy", new LocalStrategy(
        {
            usernameField:"email"
        },
        async (username, password, done)=>{
            try {
                const user = await UserModel.findOne({email:username});
                if(!user){
                    return done(null, false);
                }
                //usuario existe, validar contraseña
                if(!isValidPassword(password, user)) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });

    passport.deserializeUser(async(id,done)=>{
        const userDB = await UserModel.findById(id);
        done(null, userDB)
    });
}

