import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    parks: null,
    trips: [],
    activeTripTitles: [],
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
    toggleActiveTrip(state, newTitle) {
      if (state.activeTripTitles.includes(newTitle)) {
        state.activeTripTitles = state.activeTripTitles.filter(
          (title) => title !== newTitle
        );
      } else {
        const newActiveTripTitles = state.activeTripTitles.slice();
        newActiveTripTitles.push(newTitle);
        state.activeTripTitles = newActiveTripTitles;
      }
    },
  },
  actions: {},
  getters: {},
});

export default store;
