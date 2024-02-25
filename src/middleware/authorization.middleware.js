const PUBLIC_ROLE = "PUBLIC";

export const authorization = (aRoleCollection) => {
  return async (req, res, next) => {
    if (aRoleCollection.includes(PUBLIC_ROLE)) return next();

    if (!req.user)
      return res
        .status(401)
        .json({ status: "error", payload: "Unauthtorized" });

    // if (req.user.role !== role) return res.status(403).json({status: 'error', error: 'Not permissions'})
    if (!aRoleCollection.includes(req.user.role))
      return res
        .status(403)
        .json({ status: "error", payload: "Not permissions" });

    next();
  };
};
