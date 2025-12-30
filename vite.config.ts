import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate", // auto-updates the service worker
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "scan2pay.Mer",
        short_name: "Merchant",
        description: "Scan2Pay application.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/merchant/",
        start_url: "/merchant/",
        screenshots: [
          {
            src: "big.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "big.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        icons: [
          {
            src: "small.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "big.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "small.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "big.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],

  base: "/merchant/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
