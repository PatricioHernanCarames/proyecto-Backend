export default class UserSignupDTO {
    constructor(data) {
      this.first_name = data.first_name || data._json.name;
      this.last_name = data.last_name || data._json.surname || '';
      this.email = data.email || data._json.email;
      this.age = data.age || null;
      this.password = data.password || null;
      this.role = data.role || 'usuario'; // Default to 'usuario' if no role is provided.
    }
}

