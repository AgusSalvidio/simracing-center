import { User } from "../../../main/User/User.js";
import userModel from "../../models/user.model.js";
import { mongoose } from "mongoose";

export class UserManagerDBBased {
  async initializeUser(aPotentialUser) {
    const { firstName, lastName, email, password } = aPotentialUser;
    try {
      return new User({
        id: null, //Made this way to later when recreating the object, set db ID. -asalvidio
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
    } catch (error) {
      console.error(error.message);
    }
  }
  assertSatisfiesAllUserRequiredParameters = (aPotentialUser) => {
    const { firstName, lastName, email, password } = aPotentialUser;
    if (!firstName || !lastName || !email || !password)
      throw new Error("Faltan parámetros");
  };

  async addUser(aPotentialUser) {
    try {
      this.assertSatisfiesAllUserRequiredParameters(aPotentialUser);

      if (!(await this.hasUserAlreadyBeenAdded(aPotentialUser))) {
        const user = await this.initializeUser(aPotentialUser);
        return userModel.create(user);
      } else {
        throw new Error(
          `Ya se encuentra registrado el email ${aPotentialUser.email}`
        );
      }
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
      await this.assertHasUsers();
      this.assertUserIdIsValid(anId);
      const user = await userModel.findOne({ _id: anId }).lean();
      if (!user) throw new Error(`No se encuentra el usuario con ID ${anId}`);
      return user;
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

  async getUserByCredentials(anEmail, aPassword) {
    try {
      await this.assertHasUsers();
      const user = await userModel
        .findOne({ email: anEmail, password: aPassword })
        .lean();
      if (!user)
        throw new Error(`No se encuentra el usuario con email ${anEmail}`);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
