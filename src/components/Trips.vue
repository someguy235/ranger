<template>
  <section class="trips">
    <div class="trip-controls d-flex justify-center align-center">
      <v-btn value="all" @click="toggleActiveTrip('all')" class="mx-2">
        All
      </v-btn>
      <v-btn value="none" @click="toggleActiveTrip('none')" class="mx-2">
        None
      </v-btn>
    </div>
    <div class="trip-list pa-2">
      <div v-for="trip in trips">
        <v-card class="trip mb-2 pa-3">
          <v-row no-gutters>
            <v-col cols="9" class="d-flex align-center">
              <div class="title">
                {{ trip.title }}
              </div>
            </v-col>
            <v-col cols="3">
              <v-switch
                class="d-flex justify-end"
                inset
                hide-details
                color="blue"
                :value="trip._id"
                v-model="activeTrips"
                @change="toggleActiveTrip(trip._id)"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <div class="dates">
                {{ formatTripDates(trip.bDate, trip.eDate) }}
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <div class="miles" v-if="trip.distance">
                {{ trip.distance }} miles
              </div>
            </v-col>
          </v-row>

          <v-row no-gutters class="park-list mt-3">
            <v-col
              v-for="parkId in trip.parks"
              class="d-flex justify-center pa-1"
            >
              <img
                :src="getParkFileData(parkId)"
                :title="getParkName(parkId)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </section>
</template>

<script>
// TODO: trip path color, and persist on change
// TODO: incorporate trip cover photo
// TODO: fix toggle model trying to write to activeTrips
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Trips",
  computed: {
    ...mapGetters(["getParkFileData"]),
    ...mapState(["parks", "trips", "activeTrips"]),
  },
  methods: {
    // ...mapMutations(["toggleActiveTrip"]),
    ...mapActions(["toggleActiveTrip"]),
    getParkName(id) {
      const park = this.parks.filter((p) => p._id === id)[0];
      return park.name;
    },
    getParkFilename(id) {
      const park = this.parks.filter((p) => p._id === id)[0];
      return park.image;
    },
    getIsActive(id) {
      return this.activeTrips.includes(id);
    },
    formatTripDates(bDate, eDate) {
      const bDateObj = new Date(bDate);
      const eDateObj = new Date(eDate);

      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const tripDays = (eDateObj - bDateObj) / millisecondsPerDay + 1;
      const dayWord = tripDays > 1 ? "days" : "day";

      const bMon = bDateObj.toLocaleString("UTC", { month: "short" });
      const eMon = eDateObj.toLocaleString("UTC", { month: "short" });
      const tripMonth = bMon === eMon ? bMon : bMon + "-" + eMon;

      const bYear = bDateObj.toLocaleString("UTC", { year: "numeric" });
      const eYear = eDateObj.toLocaleString("UTC", { year: "numeric" });
      const tripYear = bYear === eYear ? bYear : bYear + "-" + eYear;

      return `${tripDays} ${dayWord} in ${tripMonth} ${tripYear}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.trips {
  display: grid;
  grid-template-rows: 75px auto;
  overflow-y: scroll;
  .title {
    font-size: 1.8rem;
  }
}
.trip-list {
  overflow-y: scroll;
}
</style>
