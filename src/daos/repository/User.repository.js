import UserDTO from "../DTOs/user.dto";

export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    getUser= async()=>{
        let result= await this.dao.get();
        return result;
    }

    createUser= async(user)=>{
        let useToInsert= new UserDTO(user);
        let result=await this.dao.create(userToInsert);
        return result;
    }
}