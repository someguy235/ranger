const { defineConfig } = require("@vue/cli-service");
const { VuetifyPlugin } = require("webpack-plugin-vuetify");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/ranger/",
  configureWebpack: {
    plugins: [new VuetifyPlugin({ autoImport: true })],
  },

  devServer: {
    proxy: {
      "/ranger/api": {
        target: "http://localhost:3002/",
        ws: false,
      },
    },
  },
});
