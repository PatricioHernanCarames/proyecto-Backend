class UserManagerMongo {
  constructor(model) {
    this.model = model;
  }

  async addUser(user) {
    try {
      const data = await this.model.create(user);
      const response = JSON.parse(JSON.stringify(data));
      return Response;
    } catch (error) {
      throw new Error(`error al guardar ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const data = await this.model.findOne(email);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`usuario con email: ${email} no encontrado`);
    }
  }
}

export {UserManagerMongo};
