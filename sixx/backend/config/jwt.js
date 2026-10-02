const jwtSecret = process.env.JWT_SECRET || process.env.T_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing. Set JWT_SECRET in backend/.env and in Render environment variables.");
}

if (!process.env.JWT_SECRET && process.env.T_SECRET) {
  console.warn("JWT_SECRET is unset; temporarily using T_SECRET. Rename T_SECRET to JWT_SECRET in backend/.env and Render.");
}

export default jwtSecret;
