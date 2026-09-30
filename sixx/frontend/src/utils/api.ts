import axios from "axios";

// Detect environment.
// NOTE: Vite only exposes env vars prefixed with VITE_ (plus MODE/PROD/DEV/etc.)
// to client code via import.meta.env — raw process vars like CODESPACE_NAME
// are NEVER available in the browser, so we must detect Codespaces at runtime
// from the actual page hostname instead of a build-time env var.
const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const isCodespacesHost = hostname.endsWith(".app.github.dev");
const isProduction = import.meta.env.PROD;

// Build dynamic base URL
let API_BASE: string | undefined = "";

// 1. GitHub Codespaces — use Vite's same-origin proxy to reach the local backend
if (isCodespacesHost) {
  API_BASE = "";
}

// 2. Production (Render, Vercel, etc.)
else if (isProduction) {
  API_BASE = import.meta.env.VITE_API_BASE || "https://fantome.onrender.com";
}

// 3. Local development fallback — talk to the local backend, not production
else {
  API_BASE = "http://localhost:5000";
}

// An empty base is intentional in Codespaces: requests use Vite's same-origin proxy.
if (typeof API_BASE !== "string") {
  API_BASE = "https://fantome.onrender.com";
}

// Normalize accidental /api duplication (SAFE VERSION)
if (API_BASE && API_BASE.endsWith("/api")) {
  API_BASE = API_BASE.replace(/\/api$/, "");
}

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⭐ ADD REQUEST INTERCEPTOR TO INJECT TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token helpers
export const setAuthToken = (token: string) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

export const getAuthToken = () => localStorage.getItem("token");

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default api;
