import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_ROLE = "Admin";
const ADMIN_PASS = "adminCod3r123";

function auth(req, res, next) {
  try {
    console.log(req.session?.user);
    if (
      (req.session?.user.email === ADMIN_EMAIL &&
        req.session?.user.role === ADMIN_ROLE) ||
      userManager.getUserById(req.session?.user.id)
    ) {
      console.log(req.session?.user);
      return next();
    }
  } catch (error) {
    return res.redirect("/login");
  }
}

export { auth, ADMIN_EMAIL, ADMIN_ROLE, ADMIN_PASS };
