import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    parks: null,
    trips: null,
    activeTrips: null,
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
    setTrips(state, trips) {
      state.trips = trips;
    },
    setActiveTrips(state, activeTrips) {
      state.activeTrips = activeTrips;
    },
  },
  actions: {},
  getters: {},
});

export default store;
