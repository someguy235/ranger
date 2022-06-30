import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    parks: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setParks(state, parks) {
      state.parks = parks;
    },
  },
  actions: {},
  getters: {},
});

export default store;
