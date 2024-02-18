import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import GithubStrategy from "passport-github2";
import { config } from "./config.js";

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const CALLBACK_URL = config.CALLBACK_URL;
const JWT_SECRET_KEY = config.JWT_SECRET_KEY;

const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

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
        secretOrKey: JWT_SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {
          console.log(jwt_payload);
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
