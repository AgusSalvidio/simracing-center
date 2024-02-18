import passport from "passport";
import passportJWT from "passport-jwt";
import {
  ADMIN_EMAIL,
  ADMIN_PASS,
  ADMIN_ROLE,
} from "../middleware/authentication.middleware.js";
import { createHash, isValidPassword } from "../../utils/utils.js";
import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { User } from "../main/User/User.js";
import GithubStrategy from "passport-github2";
import { PRIVATE_KEY } from "../../utils/jwt.js";

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

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /*
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
  });*/
};

export { initializePassport };
