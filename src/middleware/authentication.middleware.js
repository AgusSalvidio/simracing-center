ADMIN_EMAIL = "adminCoder@coder.com";
ADMIN_ROLE = "Admin";

function auth(req, res, next) {
  if (
    (req.session?.user.email === ADMIN_EMAIL &&
      req.session?.user.role === ADMIN_ROLE) ||
    userManager.findUserIdentifiedBy(req.session?.user._id)
  )
    return next();

  return res.status(401).send("Error de autenticacion");
}

export { auth };
