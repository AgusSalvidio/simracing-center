import userModel from "../../DBBasedManagers/models/user.model.js";
import { mongoose } from "mongoose";
import CustomError from "../../../../utils/errors/CustomError.js";
import {
  generateObjectNotIncludedErrorInfo,
  generateInvalidTypeErrorInfo,
} from "../../../../utils/errors/info.js";
import { EErrors } from "../../../../utils/errors/enums.js";

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
      throw error;
    }
  }

  async assertHasUsers() {
    try {
      const users = await userModel.findOne({});
      if (!users)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: "No hay usuarios",
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
    } catch (error) {
      throw error;
    }
  }

  assertUserIdIsValid(anId) {
    if (!mongoose.Types.ObjectId.isValid(anId))
      CustomError.createError({
        name: "Invalid type error",
        cause: generateInvalidTypeErrorInfo(),
        message: `El formato del ID ${anId} no cumple con el formato de UUID`,
        code: EErrors.INVALID_TYPE_ERROR,
      });
  }

  async getUserById(anId) {
    try {
      this.assertUserIdIsValid(anId);
      const user = await userModel.findOne({ _id: anId }).lean();
      if (!user)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `No se encuentra el usuario con ID ${anId}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByCredentials(anEmail) {
    try {
      const user = await userModel.findOne({ email: anEmail }).lean();
      if (!user)
        CustomError.createError({
          name: "Object not found",
          cause: generateObjectNotIncludedErrorInfo(),
          message: `No se encuentra el usuario con email ${anEmail}`,
          code: EErrors.OBJECT_NOT_INCLUDED,
        });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
