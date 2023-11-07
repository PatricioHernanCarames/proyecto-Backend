import dotenv from 'dotenv';


dotenv.config({ path: './process.env' });




export const options = {
    fileSystem:{
        usersFileName: 'users.json',
        productsFileName: 'products.json',
    },
    mongoDB:{
        url: process.env.DATABASE_URL
    },
    server:{
        port:process.env.PORT

    }
};