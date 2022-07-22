import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    parks: null,
    trips: [],
    icons: {},
    activeTrips: [],
    // TODO: why is this two places?
    activeParksFilter: "Active",
    activeParks: [],
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
    setIcons(state, icons) {
      state.icons = icons;
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
    setActiveParksFilter(state, newActiveParksFilter) {
      state.activeParksFilter = newActiveParksFilter;
    },
    updateActiveParks(state) {
      let activeParks = [];
      // showOptions: ["All", "Active", "Visited", "Not Visited", "None"],
      switch (state.activeParksFilter) {
        case "All":
          activeParks = state.parks.map((park) => park._id);
          break;
        case "None":
          activeParks = [];
          break;
        case "Active":
          activeParks = state.trips
            .filter((trip) => state.activeTrips.includes(trip._id))
            .map((trip) => trip.parks)
            .flat();
          break;
        case "Visited":
          activeParks = state.trips.map((trip) => trip.parks).flat();
          break;
        case "Not Visited":
          activeParks = state.parks
            .filter((park) => !state.activeParks.includes(park._id))
            .map((park) => park._id);
          break;
      }
      state.activeParks = activeParks;
    },
  },
  actions: {
    toggleActiveTrip(context, newId) {
      context.commit("toggleActiveTrip", newId);
      context.commit("updateActiveParks");
    },
    setActiveParksFilter(context, newActiveParksFilter) {
      context.commit("setActiveParksFilter", newActiveParksFilter);
      context.commit("updateActiveParks");
    },
  },
  getters: {
    getParkFileData: (state) => (id) => {
      const park = state.parks.filter((p) => p._id === id)[0];
      const image = park.image;
      const data = state.icons[image];
      return data;
    },
    getTripDates: (state) => {
      const tripDates = state.trips
        .sort((a, b) => (a.bDate < b.bDate ? -1 : 1))
        .map((trip) => {
          const k = trip.bDate.substring(0, 10);
          return [k, trip.title];
        });
      const tripDatesObj = {};
      for (const tripDate in tripDates) {
        tripDatesObj[tripDate] = tripDates[tripDate][1];
      }
      console.log(tripDatesObj);
      return tripDatesObj;
    },
  },
});

export default store;
