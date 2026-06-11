// Allowed static origins (local + production)
export const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",

  "https://fantometechnologies.vercel.app",
  "https://www.fantometechnologies.vercel.app",
  "http://fantometechnologies.com",
  "https://fantometechnologies.com",
  "https://www.fantometechnologies.com",
];

// Detect Codespaces dynamic origins
function isCodespacesOrigin(origin) {
  if (!origin) return false;

  // Matches:
  // https://<id>-5173.app.github.dev
  // https://<id>-5000.app.github.dev
  return origin.endsWith(".app.github.dev");
}

export const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  console.log("Request Origin:", origin);

  const isAllowed =
    allowedOrigins.includes(origin) ||
    isCodespacesOrigin(origin);

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Accept"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    return next();
  }

  console.log("❌ Blocked by CORS:", origin);
  return res.status(403).send("CORS blocked");
};
