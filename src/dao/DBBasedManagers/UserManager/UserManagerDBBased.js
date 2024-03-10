import userModel from "../../DBBasedManagers/models/user.model.js";
import { mongoose } from "mongoose";

export class UserManagerDBBased {
  async addUser(aPotentialUser) {
    try {
      return userModel.create(aPotentialUser);
    } catch (error) {
      throw error;
    }
  }

  async hasUserAlreadyBeenAdded(aPotentialUser) {
    try {
      const { email } = aPotentialUser;
      const user = await userModel.findOne({
        email: email,
      });
      return !!user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      return await userModel.find({});
    } catch (error) {
      console.error(error.message);
    }
  }

  async assertHasUsers() {
    try {
      const users = await userModel.findOne({});
      if (!users) throw new Error("No hay usuarios");
    } catch (error) {
      throw error;
    }
  }

  assertUserIdIsValid(anId) {
    if (!mongoose.Types.ObjectId.isValid(anId))
      throw new Error(
        `El formato del ID ${anId} no cumple con el formato de UUID`
      );
  }

  async getUserById(anId) {
    try {
      this.assertUserIdIsValid(anId);
      const user = await userModel.findOne({ _id: anId }).lean();
      if (!user) throw new Error(`No se encuentra el usuario con ID ${anId}`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByCredentials(anEmail) {
    try {
      const user = await userModel.findOne({ email: anEmail }).lean();
      if (!user)
        throw new Error(`No se encuentra el usuario con email ${anEmail}`);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
