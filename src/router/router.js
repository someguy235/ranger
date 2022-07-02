import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Upload from "../views/Upload.vue";
import Edit from "../views/Edit.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/upload", component: Upload, name: "Upload" },
  { path: "/edit", component: Edit, name: "Edit" },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
