<template>
  <form @submit.prevent="login">
    <input v-model="email" placeholder="email" />
    <br />
    <input v-model="password" placeholder="password" />
    <br />
    <button type="submit">Login</button>
    <button @click.prevent="cancel">Cancel</button>
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
  props: ["cancel"],
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
      // TODO: login successful?
      const { user, token } = await response.json();
      console.log(user);
      this.setUser(this.email);
      this.setToken(token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", this.email);
      this.cancel();
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
