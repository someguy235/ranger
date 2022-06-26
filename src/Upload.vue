<template>
  <div class="main">
    <div id="title">upload page ({{ user }})</div>
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
      <form @submit.prevent="upload" enctype="multipart/form-data">
        <input v-model="title" placeholder="title" required />
        <input v-model="bDate" type="date" required />
        <input v-model="eDate" type="date" required />
        <select v-model="parks" size="5" multiple required>
          <option v-for="park in availableParks" :value="park.name">
            {{ park.name }}
          </option>
        </select>
        <label>KML<input type="file" ref="kml" name="kml" required /></label>
        <label
          >IMG<input type="file" ref="image" name="image" required
        /></label>
        <button type="submit">Upload</button>
      </form>
    </div>
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
    const image = ref(null);
    return {
      kml,
      image,
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
      const params = new FormData();
      params.append("title", this.title);
      params.append("bDate", this.bDate);
      params.append("eDate", this.eDate);
      params.append("parks", this.parks);
      params.append("kml", this.kml.files[0]);
      params.append("image", this.image.files[0]);
      const response = await fetch("/ranger/api/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.token,
        },
        body: params,
      });
      const r = await response.json();
      console.log(r);
    },
    async getParks() {
      const response = await fetch("/ranger/api/parks", {
        method: "GET",
      });
      const parks = await response.json();
      this.availableParks = parks;
    },
  },
  beforeMount() {
    this.getParks();
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 10% 90%;
  grid-template-areas:
    ". title ."
    ". main .";
  height: 100%;
  justify-content: center;
}
#title {
  align-items: center;
  display: grid;
  grid-area: title;
  justify-content: center;
}
#login {
  display: grid;
  grid-area: main;
  justify-content: center;
}
#upload {
  display: grid;
  grid-area: main;
  justify-content: center;
  form {
    background-color: aquamarine;
    display: grid;
    row-gap: 1rem;
    height: 50%;
    justify-content: center;
    // align-items: center;
    input {
      margin: 0;
      padding: 0;
      width: 75%;
    }
  }
}
</style>
