import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem";

ADMIN_EMAIL = "adminCoder@coder.com";
ADMIN_ROLE = "Admin";
ADMIN_PASS = "adminCod3r123";

function auth(req, res, next) {
  if (
    (req.session?.user.email === ADMIN_EMAIL &&
      req.session?.user.role === ADMIN_ROLE) ||
    userManager.getUserById(req.session?.user._id)
  )
    return next();

  return res.redirect(401, "/login");
}

export { auth, ADMIN_EMAIL, ADMIN_ROLE, ADMIN_PASS };
