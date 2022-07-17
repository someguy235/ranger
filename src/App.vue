<template>
  <div id="container">
    <header-comp :setUser="setUser" :setToken="setToken" />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import HeaderComp from "./components/Header.vue";

export default {
  name: "App",
  components: {
    HeaderComp,
  },
  methods: {
    ...mapMutations(["setUser", "setToken", "setParks", "setIcons"]),
    async getParks() {
      const response = await fetch("/ranger/api/parks", {
        method: "GET",
      });
      const parks = await response.json();
      this.setParks(parks);
    },
    importAll(r) {
      const icons = {};
      r.keys().forEach((key) => (icons[key.replace("./", "")] = r(key)));
      this.setIcons(icons);
    },
  },
  beforeMount() {
    const authToken = localStorage.getItem("authToken");
    if (authToken && authToken !== "null") this.setToken(authToken);

    const authUser = localStorage.getItem("authUser");
    if (authUser && authUser !== "null") this.setUser(authUser);

    this.getParks();

    this.importAll(require.context("./assets/images/parks/", true, /\.png$/));
  },
};
</script>

<style>
body,
html,
#app {
  height: 100%;
  margin: auto;
  max-width: 1400px;
  padding: 0;
}
#container {
  display: grid;
  grid-template-rows: 140px calc(100vh - 140px);
}
</style>
