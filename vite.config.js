import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  base: "/ranger/",
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  server: {
    port: 8080,
    proxy: {
      "/ranger/api": {
        target: "http://localhost:3002/",
        ws: false,
      },
    },
  },
});
