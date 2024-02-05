import passport from "passport";
import localPassport from "passport-local";
import {
  ADMIN_EMAIL,
  ADMIN_PASS,
  ADMIN_ROLE,
} from "../middleware/authentication.middleware.js";
import { createHash, isValidPassword } from "../../utils.js";
import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { User } from "../main/User/User.js";

const LocalStrategy = localPassport.Strategy;

const ADMIN_USER = {
  _id: "11a111aa111111111aa11aaa",
  firstName: ADMIN_ROLE,
  lastName: ADMIN_ROLE,
  email: ADMIN_EMAIL,
  password: ADMIN_PASS,
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firstName, lastName, email } = req.body;
        try {
          const potentialUser = {
            firstName,
            lastName,
            email,
            password: createHash(password),
          };

          const registeredUser = await userManager.addUser(potentialUser);
          return done(null, registeredUser);
        } catch (error) {
          return done(null, false, req.flash("error", error.message));
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          if (username == ADMIN_EMAIL || password == ADMIN_PASS) {
            const user = ADMIN_USER;
            return done(null, user);
          }

          const user = await userManager.getUserByCredentials(username);
          if (!isValidPassword(password, user.password)) {
            return done(
              null,
              false,
              req.flash("error", "Contraseña incorrecta")
            );
          }
          return done(null, user);
        } catch (error) {
          return done(null, false, req.flash("error", error.message));
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    //Check if its the hardcoded user
    if (id == ADMIN_USER._id) {
      return done(null, ADMIN_USER);
    } else {
      const user = await userManager.getUserById(id);
      return done(null, user);
    }
  });
};

export { initializePassport };
