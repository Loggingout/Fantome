export const adminOnly = (
  req,
  res,
  next
) => {
  if (
    req.employee.role !==
    "admin"
  ) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  next();
};