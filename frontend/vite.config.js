// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // optional: if you want proxying /api to your backend during dev
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
