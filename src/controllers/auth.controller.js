import { createHash, isValidPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
import { config } from "../config/config.js";
import { userService } from "../repositories/index.js";
import { cartService } from "../repositories/index.js";
import UserDetails from "../dto/User/UserDetails.js";

const { ADMIN_EMAIL, ADMIN_PASS, ADMIN_ROLE } = config;

class AuthController {
  constructor() {
    this.service = userService;
  }

  logout = (req, res) => {
    return res
      .clearCookie("cookieToken")
      .status(200)
      .send({ status: "success", payload: "Logout Successful" });
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    let user;

    if (email == ADMIN_EMAIL && password == ADMIN_PASS) {
      const adminID = "11a111aa111111111aa11aaa";
      let adminCart;
      try {
        adminCart = await cartService.getCartById(adminID);
      } catch (error) {
        adminCart = await cartService.addCustomCart(adminID, []);
      }

      user = {
        _id: adminID,
        email: ADMIN_EMAIL,
        role: ADMIN_ROLE,
        cart: adminCart,
      };
    } else {
      try {
        user = await this.service.getUserByCredentials(email);

        if (!isValidPassword(password, user.password)) {
          return res
            .status(401)
            .send({ status: "failed", payload: "Contraseña incorrecta" });
        }
      } catch (error) {
        return res
          .status(401)
          .send({ status: "failed", payload: error.message });
      }
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
    const user = await this.service.getUserByCredentials(req.user.email);
    const userDetails = new UserDetails({
      fullName: `${user.firstName} ${user.lastName}`,
      email: req.user.email,
      cartID: req.user.cartID,
    });
    res.send({ status: "success", payload: userDetails });
  };
}

export default AuthController;
