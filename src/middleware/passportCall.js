import passport from "passport";

const passportCall = (strategy) => {
  return async (req, res, next) => {
    // done(null, jwt_payload, info -> passport) - done(null, false, {message: 'User not found'})
    passport.authenticate(strategy, function (err, user, info) {
      console.log("El user es", user);
      if (err) return next(err);
      if (!user)
        // return res.status(401).render("authFail", {
        //   title: "Error",
        //   errorMessage: {
        //     status: "error",
        //     payload: info.message ? info.message : info.toString(),
        //   },
        //   style: "index.css",
        // });
        return res.status(401).redirect("login");
      req.user = user;
      next();
    })(req, res, next);
  };
};

export { passportCall };
