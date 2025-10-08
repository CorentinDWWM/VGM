import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: [
            "react-icons/io5",
            "react-icons/go",
            "react-icons/md",
            "react-icons/fa6",
            "react-icons/bs",
            "react-icons/vsc",
            "react-icons/tb",
            "react-icons/gi",
            "react-icons/wi",
            "react-icons/fa",
          ],
          charts: ["recharts"],
        },
      },
    },
    // Optimisation pour réduire la taille
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
