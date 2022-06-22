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
    <!-- <div>{{ token }}</div> -->
    <form @submit.prevent="upload">
      <input v-model="title" placeholder="title" />
      <br />
      <input v-model="bDate" type="date" />
      <br />
      <input v-model="eDate" type="date" />
      <br />
      <input v-model="parks" />
      <br />
      <button type="submit">Upload</button>
    </form>
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
      title: "",
      bDate: "",
      eDate: "",
      kml: null,
      image: null,
      parks: [],
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
    async upload() {
      const response = await fetch("/ranger/api/upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + this.token,
        },
        body: JSON.stringify({
          title: "Test trip",
        }),
      });
      const r = response.json();
      console.log(r);
    },
  },
};
</script>

<style lang="scss" scoped></style>
