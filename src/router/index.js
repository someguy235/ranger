import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import NotFound from "../NotFound.vue";
import Upload from "../views/Upload.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  // { path: "/", component: NotFound },
  { path: "/upload", component: Upload, name: "Upload" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
