<template>
  <v-form @submit.prevent="login">
    <v-container>
      <v-row no-gutters>
        <v-col>
          <v-text-field
            density="compact"
            v-model="username"
            placeholder="username"
          />
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
  <v-snackbar v-model="snackMsg">{{ snackMsg }}</v-snackbar>
</template>

<script>
// TODO: get refresh expire date from login endpoint and persist to localstorage, then check on page load
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      snackMsg: null,
    };
  },
  props: ["cancel"],
  methods: {
    ...mapMutations(["setUser", "setToken"]),
    async login() {
      const response = await fetch("/ranger/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (response.status === 200) {
        const { token } = await response.json();
        if (token) {
          this.setUser(this.username);
          this.setToken(token);
          localStorage.setItem("authToken", token);
          localStorage.setItem("authUser", this.username);
          this.cancel();
        } else {
          this.snackMsg = "something went wrong";
        }
      } else {
        this.snackMsg = "something went wrong";
      }
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
