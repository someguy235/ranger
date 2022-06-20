<template>
  <component :is="currentView" />
</template>

<script>
import Home from "./Home.vue";
import Upload from "./Upload.vue";
import NotFound from "./NotFound.vue";
const routes = {
  "/": Home,
  "/upload": Upload,
};
export default {
  data() {
    return { currentPath: window.location.hash };
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || "/"] || NotFound;
    },
  },
  mounted() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.hash;
    });
  },
};
</script>

<style lang="scss" scoped></style>
