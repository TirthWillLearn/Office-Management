import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

export default api;
