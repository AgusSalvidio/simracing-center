import { createHash, isValidPassword } from "../../utils/bcrypt.js";
import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { generateToken } from "../../utils/jwt.js";

class AuthController {
  constructor() {
    this.service = userManager;
  }

  logout = (req, res) => {
    return res
      .clearCookie("cookieToken")
      .status(200)
      .send({ status: "success", payload: "Logout Successful" });
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    const user = await this.service.getUserByCredentials(email);

    if (!isValidPassword(password, user.password)) {
      return res
        .status(401)
        .send({ status: "failed", payload: "Contraseña incorrecta" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      cartID: user.cart._id,
    });

    return res
      .status(200)
      .cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .send({ status: "success", payload: "Login Successful" });
  };

  register = async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;
    try {
      const potentialUser = {
        firstName,
        lastName,
        age,
        email,
        password: createHash(password),
      };

      await this.service.addUser(potentialUser);

      return res
        .status(200)
        .send({ status: "success", payload: "Register Successful" });
    } catch (error) {
      throw error;
    }
  };

  githubcallback = async (req, res) => {
    const token = generateToken({
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      cartID: req.user.cart._id,
    });

    res
      .status(200)
      .cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .redirect("/products");
  };

  current = async (req, res) => {
    res.send({ status: "success", payload: req.user });
  };
}

export default AuthController;
