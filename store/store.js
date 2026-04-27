import { defineStore } from "pinia";

export const useRangerStore = defineStore("ranger", {
  state: () => ({
    user: null,
    token: null,
    parks: null,
    trips: [],
    icons: {},
    activeTrips: [],
    activeParksFilter: "Active",
    activeParks: [],
    mousedPark: null,
  }),
  getters: {
    getParkFileData: (state) => (id) => {
      const park = state.parks.filter((p) => p._id === id)[0];
      const image = park.image;
      return state.icons[image];
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
      return tripDatesObj;
    },
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
    },
    setParks(parks) {
      this.parks = parks;
    },
    setTrips(trips) {
      this.trips = trips;
    },
    setIcons(icons) {
      this.icons = icons;
    },
    toggleActiveTrip(newId) {
      if (newId === "all") {
        this.activeTrips = this.trips.map((trip) => trip._id);
      } else if (newId === "none") {
        this.activeTrips = [];
      } else {
        if (this.activeTrips.includes(newId)) {
          this.activeTrips = this.activeTrips.filter((id) => id !== newId);
        } else {
          this.activeTrips = [...this.activeTrips, newId];
        }
      }
      this._updateActiveParks();
    },
    setActiveParksFilter(newActiveParksFilter) {
      this.activeParksFilter = newActiveParksFilter;
      this._updateActiveParks();
    },
    _updateActiveParks() {
      let activeParks = [];
      let visitedParks;
      switch (this.activeParksFilter) {
        case "All":
          activeParks = this.parks.map((park) => park._id);
          break;
        case "None":
          activeParks = [];
          break;
        case "Active":
          activeParks = this.trips
            .filter((trip) => this.activeTrips.includes(trip._id))
            .map((trip) => trip.parks)
            .flat();
          break;
        case "Visited":
          activeParks = this.trips.map((trip) => trip.parks).flat();
          break;
        case "Not Visited":
          visitedParks = this.trips.map((trip) => trip.parks).flat();
          activeParks = this.parks
            .filter((park) => !visitedParks.includes(park._id))
            .map((park) => park._id);
          break;
      }
      this.activeParks = activeParks;
    },
    setMousedPark(mousedParkId) {
      this.mousedPark = mousedParkId;
    },
  },
});
