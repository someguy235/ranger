<template>
  <header class="header">
    <div></div>
    <div class="header-content">
      <div class="logo">Ranger Logo</div>
      <div v-if="user" class="nav">
        <v-container
          class="h-100 d-flex flex-column justify-center align-center"
        >
          <v-row class="d-flex justify-center">
            <v-col>
              <span v-if="path === '/'">Home</span>
              <router-link v-else to="/">Home</router-link>
            </v-col>
            <v-col>
              <span v-if="path === '/upload'">Upload</span>
              <router-link v-else to="/upload">Upload</router-link>
            </v-col>
            <v-col>
              <span v-if="path === '/edit'">Edit</span>
              <router-link v-else to="/edit">Edit</router-link>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col>
              <v-btn variant="flat" @click="logout">Logout</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div v-if="!user && !showLogin">
        <button @click="showLogin = true">login</button>
      </div>
      <div class="login" v-if="showLogin">
        <login :cancel="cancelLogin" />
      </div>
    </div>
    <div></div>
  </header>
</template>

<script>
import { computed } from "@vue/reactivity";
import { mapState } from "vuex";
import { useRoute } from "vue-router";

import Login from "./Login.vue";

export default {
  name: "Header",
  components: {
    Login,
  },
  computed: {
    ...mapState(["user"]),
  },
  setup() {
    const route = useRoute();
    return {
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
  width: 100%;
  .header-content {
    background-color: #e9baf1;
    display: grid;
    grid-template-columns: 75% auto auto;
    .nav {
      background-color: cornflowerblue;
    }
    .logo {
      border: 1px solid grey;
    }
  }
  .login {
    background-color: aquamarine;
    border: 1px solid grey;
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
