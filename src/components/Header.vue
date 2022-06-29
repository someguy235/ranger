<template>
  <header class="header">
    <div></div>
    <div class="header-content">
      <div>Ranger Logo</div>
      <div v-if="user" id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/Upload">Upload</router-link> |
        <router-link to="/Edit">Edit</router-link>
        <div class="logout">
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div v-if="!user && !showLogin">
        <button @click="showLogin = true">login</button>
      </div>
      <div v-if="showLogin">
        <login :cancel="cancelLogin" />
      </div>
    </div>
    <div></div>
  </header>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

import Login from "./Login.vue";

export default {
  name: "Header",
  components: {
    Login,
  },
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.state.user),
    };
  },
  data() {
    return {
      showLogin: false,
    };
  },
  methods: {
    logout() {
      console.log("logout");
      localStorage.setItem("authToken", null);
      localStorage.setItem("authUser", null);
      this.setUser(null);
      this.setToken(null);
    },
    cancelLogin() {
      this.showLogin = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: grid;
  grid-template-columns: auto minmax(50%, 1140px) auto;
  grid-template-rows: 100px;
  width: 100%;
  .header-content {
    background-color: #e9baf1;
    display: grid;
    grid-template-columns: 75% auto auto;
  }
}
</style>
