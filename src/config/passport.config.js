import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import GithubStrategy from "passport-github2";
import { config } from "./config.js";
import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

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

/*Actually, we should save the birthdate not the age, but to comply with the this delivery,
it stays like this. In future deliveries this will be changed. Also for Github login, if the 
birthdate its not provided, then it will be setted with the account creation date. -asalvidio
*/
const calculateAge = (profile) => {
  if (profile.birthdate) {
    const birthdate = new Date(profile.birthdate);
    const ageDiff = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } else {
    return 100; //Handled the age when birthdate its not provided -asalvidio
  }
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
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
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
                age: calculateAge(profile._json),
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
    const user = await userManager.getUserById(id);
    return done(null, user);
  });
};

export { initializePassport };
