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
      <select v-model="parks" size="5" multiple>
        <option v-for="park in availableParks" :value="park.name">
          {{ park.name }}
        </option>
      </select>
      <br />
      <label>KML<input type="file" ref="kml" /></label>
      <br />
      <label>IMG<input type="file" ref="img" /></label>
      <br />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { ref } from "vue";
export default {
  setup() {
    const store = useStore();
    const kml = ref(null);
    const img = ref(null);
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
      //   kml: null,
      //   image: null,
      availableParks: [],
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
      console.log(`title: ${this.title}`);
      console.log(`bDate: ${this.bDate}`);
      console.log(`eDate: ${this.eDate}`);
      console.log(`parks: ${this.parks}`);
      console.log(`kml: ${kml}`);
      console.log(`img: ${img}`);
      //   const response = await fetch("/ranger/api/upload", {
      //     method: "POST",
      //     headers: {
      //       "Content-type": "application/json",
      //       Authorization: "Bearer " + this.token,
      //     },
      //     body: JSON.stringify({
      //       title: "Test trip",
      //     }),
      //   });
      //   const r = await response.json();
      //   console.log(r);
    },
    async getParks() {
      const response = await fetch("/ranger/api/parks", {
        method: "GET",
      });
      const parks = await response.json();
      console.log(parks);
      this.availableParks = parks;
    },
  },
  beforeMount() {
    this.getParks();
  },
};
</script>

<style lang="scss" scoped></style>
