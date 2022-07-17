import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    parks: null,
    trips: [],
    activeTrips: [],
    activeParks: [],
    icons: {},
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
      if (newId === "all") {
        state.activeTrips = state.trips.map((trip) => trip._id);
      } else if (newId === "none") {
        state.activeTrips = [];
      } else {
        if (state.activeTrips.includes(newId)) {
          state.activeTrips = state.activeTrips.filter((id) => id !== newId);
        } else {
          const newActiveTrips = state.activeTrips.slice();
          newActiveTrips.push(newId);
          state.activeTrips = newActiveTrips;
        }
      }
    },
    setIcons(state, icons) {
      state.icons = icons;
    },
  },
  actions: {},
  getters: {
    getParkFileData: (state) => (id) => {
      const park = state.parks.filter((p) => p._id === id)[0];
      const image = park.image;
      const data = state.icons[image];
      return data;
    },
  },
});

export default store;
