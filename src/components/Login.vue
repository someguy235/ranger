<template>
  <form @submit.prevent="login">
    <input v-model="email" placeholder="email" />
    <br />
    <input v-model="password" placeholder="password" />
    <br />
    <button type="submit">Login</button>
  </form>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    return {
      setUser: (user) => store.commit("setUser", user),
      setToken: (token) => store.commit("setToken", token),
    };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const response = await fetch("/ranger/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });
      const { user, token } = await response.json();
      this.setUser(this.email);
      this.setToken(token);
    },
  },
};
</script>

<style>
#login {
  display: grid;
  grid-area: main;
  justify-content: center;
}
</style>
