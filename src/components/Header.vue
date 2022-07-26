<template>
  <header class="header">
    <div></div>
    <div class="header-content">
      <span class="title px-8">Ranger</span>
      <div v-if="user" class="nav">
        <v-container
          class="h-100 d-flex flex-column justify-center align-center"
        >
          <v-row class="d-flex justify-center">
            <v-col class="d-flex align-center user">
              <v-icon icon="mdi-account"></v-icon>{{ user }}
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col class="d-flex align-center">
              <v-btn variant="flat" @click="logout">Logout</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div v-if="!user && !showLogin">
        <v-container
          class="h-100 d-flex flex-column justify-center align-center"
        >
          <v-row class="d-flex justify-center">
            <v-col class="d-flex align-center">
              <v-btn variant="flat" @click="showLogin = true">login</v-btn>
            </v-col>
          </v-row>
        </v-container>
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
@import url("https://fonts.googleapis.com/css2?family=Vibur&display=swap");
.header {
  display: grid;
  grid-template-columns: auto minmax(50%, 1100px) auto;
  width: 100%;
  .header-content {
    background-color: #e9baf1;
    background-size: cover !important;
    background: radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 37%,
        rgba(0, 0, 0, 0.65) 100%
      ),
      url(../assets/images/ranger-header.jpg) no-repeat center center scroll;

    display: grid;
    grid-template-columns: auto 20%;
    margin: 20px 0;
    .title {
      color: white;
      font-family: "Vibur";
      font-size: 6rem;
      font-weight: 400;
    }
    .nav {
      font-family: "Roboto";
      .user {
        color: white;
      }
      span {
        color: white;
      }
      a {
        color: white;
      }
    }
  }
  .login {
    background-color: white;
    border: 1px solid grey;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1000;
  }
}
</style>
