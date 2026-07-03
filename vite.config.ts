import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: { main: resolve(__dirname, "index.html") },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
