import passport from "passport";

const passportCall = (strategy) => {
  return async (req, res, next) => {
    // done(null, jwt_payload, info -> passport) - done(null, false, {message: 'User not found'})
    passport.authenticate(strategy, function (err, user, info) {
      console.log(user);
      if (err) return next(err);
      if (!user)
        return res.status(401).send({
          status: "error",
          payload: info.message ? info.message : info.toString(),
        });
      req.user = user;
      next();
    })(req, res, next);
  };
};

export { passportCall };
