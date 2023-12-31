class UserManagerMongo{
    constructor(model){
        this.model=model;
    };

    async addUser(user){
        try {
            const data = await this.model.create(user);
            const response = data.toObject();
            return response;
        } catch (error) {
            throw new Error(`Error al guardar: ${error.message}`);
        }
    };

    async getUserByEmail(email){
        try {
            const data = await this.model.findOne({email:email});
            const response = data.toObject();
            return response;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    };
}

export {UserManagerMongo};