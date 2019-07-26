const userModel = require("../models/user");

class User {
  constructor(body) {
    this.body = body;
  }
  async createUser() {
    try {
      let user = await userModel.register(
        new userModel({ username: this.body.username, mail: this.body.mail }),
        this.body.password
      );
      if (!user) res.json({ message: "Problem logging in" });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async listUser(filter, project) {
    try {
      let data = await userModel.find(filter, project);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id) {
    try {
      let user = await userModel.findOneAndUpdate(
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
      let user = await userModel.findOneAndUpdate(
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
