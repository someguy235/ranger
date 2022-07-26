<template>
  <v-form @submit.prevent="login">
    <v-container>
      <v-row no-gutters>
        <v-col>
          <v-text-field density="compact" v-model="email" placeholder="email" />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
            density="compact"
            v-model="password"
            placeholder="password"
          />
        </v-col>
      </v-row>
      <v-row class="h-25">
        <v-col><v-btn type="submit">Login</v-btn></v-col>
        <v-col><v-btn @click.prevent="cancel">Cancel</v-btn></v-col>
      </v-row>
    </v-container>
  </v-form>
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
