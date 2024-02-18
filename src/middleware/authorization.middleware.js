const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ status: "error", payload: "Unauthorized" });
    if (req.user.role !== role)
      return res
        .status(401)
        .json({ status: "error", payload: "Not permissions" });
    next();
  };
};

export { authorization };
