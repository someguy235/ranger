<template>
  <v-app>
    <div id="container">
      <header-comp :setUser="setUser" :setToken="setToken" />
      <home />
    </div>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";
import Home from "./views/Home.vue";
import HeaderComp from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Home,
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
    const refreshExpire = localStorage.getItem("refreshExpire");
    if (refreshExpire && refreshExpire !== "null") {
      const refreshExpireDate = new Date(refreshExpire * 1000);
      const now = new Date();
      if (refreshExpireDate > now) {
        const authToken = localStorage.getItem("authToken");
        if (authToken && authToken !== "null") this.setToken(authToken);
        const authUser = localStorage.getItem("authUser");
        if (authUser && authUser !== "null") this.setUser(authUser);
      }
    }

    this.getParks();

    this.importAll(require.context("./assets/images/parks/", true, /\.png$/));
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Vibur&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

body,
html {
  height: 100%;
  padding: 0;
}
#app {
  height: 100%;
  margin: auto;
  max-width: 1400px;
  padding: 0;
}
#container {
  display: grid;
  grid-template-rows: 180px calc(100vh - 180px);
}
</style>
