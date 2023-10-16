import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });


const mongoURL = process.env.DATABASE_URL;

export const options = {
    fileSystem:{
        usersFileName: 'users.json',
        productsFileName: 'products.json',
    },
    mongoDB:{
        url:mongoURL
    }
};