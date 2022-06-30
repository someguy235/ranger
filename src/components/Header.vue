<template>
  <header class="header">
    <div></div>
    <div class="header-content">
      <div>Ranger Logo</div>
      <div v-if="user" id="nav">
        <span v-if="path === '/'">Home</span>
        <router-link v-else to="/">Home</router-link> |
        <span v-if="path === '/upload'">Upload</span>
        <router-link v-else to="/upload">Upload</router-link> |
        <span v-if="path === '/edit'">Edit</span>
        <router-link v-else to="/edit">Edit</router-link>
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
import { useRoute } from "vue-router";

import Login from "./Login.vue";

export default {
  name: "Header",
  components: {
    Login,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    return {
      user: computed(() => store.state.user),
      path: computed(() => route.path),
    };
  },
  data() {
    return {
      showLogin: false,
    };
  },
  props: ["setUser", "setToken"],
  methods: {
    logout() {
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
