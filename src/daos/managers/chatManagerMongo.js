class chatManagerMongo{
    constructor(model){
        this.model = model;
    }

    async addMessage(object){
        try {
            const data = await this.model.create(object);
            const response = data.toObject();;
            return response;
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`);
        }
    };

    async getMessages(){
        try {
            const data = await this.model.find();
            const response = data.toObject();
            return response;
        } catch (error) {
            throw new Error(`Error get all ${error}`);
        }
    };
}

export {chatManagerMongo};