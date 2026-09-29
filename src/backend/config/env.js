import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(
  __dirname,
  "../.env"
);

dotenv.config({
  path: envPath,
});

console.log(
  "MONGODB_URI exists?",
  process.env.MONGODB_URI
    ? "YES ✓"
    : "NO ✗"
);

console.log(
  "UNO_API_KEY exists?",
  process.env.UNO_API_KEY
    ? "YES ✓"
    : "NO ✗"
);

console.log(
  "EMAIL_FROM exists?",
  process.env.EMAIL_FROM
    ? "YES ✓"
    : "NO ✗"
);

console.log(
  "EMAIL_TO exists?",
  process.env.EMAIL_TO
    ? "YES ✓"
    : "NO ✗"
);