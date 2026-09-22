export const adminOnly = (req, res, next) => {
  if (req.user.accountType !== "admin") {
    return res.status(403).json({
      message: "Admin access is required.",
    });
  }

  next();
};