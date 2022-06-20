<template>
  <div>upload page</div>
  <div id="login" v-if="token === null">
    <form @submit.prevent="login">
      <input v-model="email" placeholder="email" />
      <br />
      <input v-model="password" placeholder="password" />
      <br />
      <button type="submit">Login</button>
    </form>
  </div>
  <div id="upload" v-if="token !== null">
    <div>{{ user }}</div>
    <div>{{ token }}</div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.state.user),
      token: computed(() => store.state.token),
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

<style lang="scss" scoped></style>
