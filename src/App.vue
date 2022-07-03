<template>
  <header-comp :setUser="setUser" :setToken="setToken" />
  <router-view></router-view>
</template>

<script>
import { useStore } from "vuex";
import HeaderComp from "./components/Header.vue";

export default {
  name: "App",
  components: {
    HeaderComp,
  },
  setup() {
    const store = useStore();
    return {
      setUser: (user) => store.commit("setUser", user),
      setToken: (token) => store.commit("setToken", token),
      setParks: (parks) => store.commit("setParks", parks),
    };
  },
  methods: {
    async getParks() {
      const response = await fetch("/ranger/api/parks", {
        method: "GET",
      });
      const parks = await response.json();
      this.setParks(parks);
    },
  },
  beforeMount() {
    const authToken = localStorage.getItem("authToken");
    if (authToken && authToken !== "null") this.setToken(authToken);

    const authUser = localStorage.getItem("authUser");
    if (authUser && authUser !== "null") this.setUser(authUser);

    this.getParks();
  },
};
</script>

<style>
body,
html,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
