export const requestLogger = (
  req,
  res,
  next
) => {
  console.log(
    `${req.method} ${
      req.url
    } - Origin: ${
      req.headers.origin ||
      "no origin"
    }`
  );

  next();
};