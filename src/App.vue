<template>
  <v-app>
    <div id="container">
      <header-comp :setUser="setUser" :setToken="setToken" />
      <home />
    </div>
  </v-app>
</template>

<script>
import { mapActions } from "pinia";
import { useRangerStore } from "../store/store";
import Home from "./views/Home.vue";
import HeaderComp from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Home,
    HeaderComp,
  },
  methods: {
    ...mapActions(useRangerStore, ["setUser", "setToken", "setParks", "setIcons"]),
    async getParks() {
      const response = await fetch("/ranger/api/parks", {
        method: "GET",
      });
      const parks = await response.json();
      this.setParks(parks);
    },
    importAll() {
      const modules = import.meta.glob("./assets/images/parks/*.png", { eager: true });
      const icons = {};
      Object.entries(modules).forEach(([key, mod]) => {
        icons[key.replace("./assets/images/parks/", "")] = mod.default;
      });
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

    this.importAll();
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
