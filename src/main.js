import { createApp } from "vue";
import App from "./App.vue";
import store from "../store/store";
import router from "./router/router";
import vuetify from "./plugins/vuetify";

import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify);
app.mount("#app");
