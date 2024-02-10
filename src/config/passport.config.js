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
import GithubStrategy from "passport-github2";

const LocalStrategy = localPassport.Strategy;

//Complete with your Github credentials
const CLIENT_ID = "";
const CLIENT_SECRET = "";
const CALLBACK_URL = "http://localhost:8080/api/auth/githubcallback";

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

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          try {
            let user = await userManager.getUserByCredentials(
              profile._json.email
            );
            return done(null, user);
          } catch (error) {
            if (
              error.message ==
              `No se encuentra el usuario con email ${profile._json.email}`
            ) {
              const newUser = {
                firstName: profile._json.name,
                lastName: profile._json.name,
                email: profile._json.email,
                password: "",
              };
              const addedUser = await userManager.addUser(newUser);
              return done(null, addedUser);
            } else {
              throw error;
            }
          }
        } catch (error) {
          return done(error);
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
