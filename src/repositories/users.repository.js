import { User } from "../dto/User/User.js";

export default class UserRepository {
  constructor(userDao, cartDao) {
    this.dao = userDao;
    this.cartDao = cartDao;
  }

  async initializeUser(aPotentialUser) {
    const { firstName, lastName, age, email, password } = aPotentialUser;
    try {
      const { _id: id } = await this.cartDao.addCart();
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

      if (!(await this.dao.hasUserAlreadyBeenAdded(aPotentialUser))) {
        const user = await this.initializeUser(aPotentialUser);
        return await this.dao.addUser(user);
      } else {
        throw new Error(
          `Ya se encuentra registrado el email ${aPotentialUser.email}`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserById(anId) {
    try {
      return await this.dao.getUserById(anId);
    } catch (error) {
      throw error;
    }
  }
  async getUserByCredentials(anEmail) {
    try {
      return await this.dao.getUserByCredentials(anEmail);
    } catch (error) {
      throw error;
    }
  }
}
