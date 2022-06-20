// import Vue from "vue";
import { createApp } from "vue";
import App from "./App.vue";
import store from "../store/store";

// Vue.config.productionTip = false;

// new Vue({
//   store,
//   render: (h) => h(App),
// }).$mount("#app");

const app = createApp(App);
app.use(store);
app.mount("#app");
