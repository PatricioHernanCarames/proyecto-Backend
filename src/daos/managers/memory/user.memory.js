import {v4 as uuidv4} from "uuid";

export class UserMemory{
    constructor(){
        this.users = [
            {id: uuidv4(),
             name:"John",
             email:"john@gmail.com"
            },
        ];
    }
    get(){
        return this.users;
    }
    post(user){
        user.id=uuidv4();
        this.users.push(user);
        return user;
    }
    async getById(id){
        const user= this.user.find(u=>u.id===id);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }
}