import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
    port: 5173,
    strictPort: true,
    host: "localhost",
    origin: "http://localhost:5173",
  },
});
