import { User } from "../../../dto/User/User.js";
import userModel from "../../DBBasedManagers/models/user.model.js";
import { mongoose } from "mongoose";
import { cartManager } from "../ManagerSystem/ManagerSystem.js";

export class UserManagerDBBased {
  async initializeUser(aPotentialUser) {
    const { firstName, lastName, age, email, password } = aPotentialUser;
    try {
      const { _id: id } = await cartManager.addCart();
      return new User({
        id: null, //Made this way to later when recreating the object, set db ID. -asalvidio
        firstName: firstName,
        lastName: lastName,
        age: age,
        cart: id,
        email: email,
        password: password,
      });
    } catch (error) {
      console.error(error.message);
    }
  }
  assertSatisfiesAllUserRequiredParameters = (aPotentialUser) => {
    const { firstName, lastName, age, email } = aPotentialUser;
    if (!firstName || !lastName || !age || !email)
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

  parseUsers(potentialUsers) {
    const parsedUsers = potentialUsers.map(
      (potentialUser) => new User(potentialUser)
    );
    return parsedUsers;
  }
}
