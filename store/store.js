// import Vue from "vue";
// import Vuex from "vuex";
// Vue.use(Vuex);
import { createStore } from "vuex";

// export default new Vuex.Store({
const store = createStore({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
  getters: {},
});

export default store;
