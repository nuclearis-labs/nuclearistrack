const UserModel = require('../models/user');

class User {
  constructor(body) {
    this.body = body;
  }

  async createUser() {
    try {
      await UserModel.register(
        new UserModel({ username: this.body.username, mail: this.body.mail }),
        this.body.password
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async listUser(filter, project) {
    try {
      const data = await UserModel.find(filter, project);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: this.body },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteUser(id) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { active: false } },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
module.exports = User;
