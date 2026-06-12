import axios from "axios";

// Detect environment
const isCodespaces = Boolean(import.meta.env.CODESPACE_NAME);
const isProduction = import.meta.env.PROD;

// Build dynamic base URL
let API_BASE: string | undefined = "";

// 1. GitHub Codespaces
if (isCodespaces) {
  const { CODESPACE_NAME, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN } = import.meta.env;

  if (CODESPACE_NAME && GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    API_BASE = `https://${CODESPACE_NAME}-5000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  }
}

// 2. Production (Render, Vercel, etc.)
else if (isProduction) {
  API_BASE = import.meta.env.VITE_API_BASE || "";
}

// 3. Local development fallback
else {
  API_BASE = "https://fantome.onrender.com";
}

// FINAL SAFETY NET — ensure API_BASE is ALWAYS a string
if (!API_BASE || typeof API_BASE !== "string") {
  API_BASE = "https://fantome.onrender.com";
}

// Normalize accidental /api duplication (SAFE VERSION)
if (API_BASE && API_BASE.endsWith("/api")) {
  API_BASE = API_BASE.replace(/\/api$/, "");
}

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
