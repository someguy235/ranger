import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    parks: null,
    trips: [],
    activeTrips: [],
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
    toggleActiveTrip(state, newId) {
      if (state.activeTrips.includes(newId)) {
        state.activeTrips = state.activeTrips.filter((id) => id !== newId);
      } else {
        const newActiveTrips = state.activeTrips.slice();
        newActiveTrips.push(newId);
        state.activeTrips = newActiveTrips;
      }
    },
  },
  actions: {},
  getters: {},
});

export default store;
