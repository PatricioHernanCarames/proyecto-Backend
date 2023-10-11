import passport from "passport";
import LocalStrategy  from "passport-local";
import GitHubStrategy from "passport-github2"
import { UserModel } from "../daos/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { access } from "fs";

export const initializePassport = ()=>{

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.1b71fac663dc8a63' ,
        clientSecret: '1ad946a0c680558093c3fab3ec94ff141ce921d5',
        callbackURL:'http://localhost:8080/api/sesions/github-calback'
    }, async(accessToken, refreshToken,profile,done)=>{
        try {
            console.log(profile);
            let user= await userService.findone({email:profile._json.email});
            if (!user) {
                let newUser={
                    first_name : profile._json.email,
                    last_name:'',
                    age:'18',
                    email: profile._json.email,
                    password:''
                }
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
                
            }
        } catch (error) {
            return done(error)
        }

    }))
    
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
                
                let rol='user';
                if (username.endsWith("@coder.com")) {
                    rol = "admin";
                }
                
                const newUser = {
                    name,
                    email:username,
                    password:createHash(password),
                    rol
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