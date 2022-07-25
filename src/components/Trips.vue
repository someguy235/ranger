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
        <v-card elevation="3" class="trip mb-4 pb-2">
          <v-img v-if="trip.image" :src="trip.image" cover>
            <TripInfo :trip="trip" />
          </v-img>
          <div v-else class="pb-3"><TripInfo :trip="trip" /></div>
          <v-row v-if="trip.color" no-gutters class="">
            <v-col>
              <div
                :style="{
                  'background-color': trip.color,
                  height: '12px',
                }"
              ></div>
            </v-col>
          </v-row>
          <v-row no-gutters class="park-list pt-3">
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
          <v-row no-gutters>
            <v-col cols="6" class="d-flex justify-center align-center">
              <v-btn variant="outlined" @click="toggleEdit(trip)">
                <v-icon icon="mdi-clipboard-edit"></v-icon>
              </v-btn>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="4" class="d-flex justify-center">
              <v-switch
                inset
                hide-details
                color="blue"
                :value="trip._id"
                v-model="activeTripsData"
                @change="toggleActiveTrip(trip._id)"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card>
      </div>
      <div class="d-flex justify-center">
        <v-btn @click="toggleUpload">New</v-btn>
      </div>
    </div>
  </section>
</template>

<script>
// TODO: only show color when kml present
import { mapActions, mapGetters, mapState } from "vuex";
import TripInfo from "./TripInfo";

export default {
  name: "Trips",
  props: ["toggleUpload", "toggleEdit"],
  components: {
    TripInfo,
  },
  data() {
    return {
      activeTripsData: [],
    };
  },
  computed: {
    ...mapGetters(["getParkFileData"]),
    ...mapState(["parks", "trips", "activeTrips"]),
  },
  methods: {
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
  },
  watch: {
    "$store.state.activeTrips": {
      handler() {
        this.activeTripsData = this.activeTrips;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.trips {
  display: grid;
  grid-template-rows: 75px auto;
  overflow-y: scroll;
  .trip-list {
    overflow-y: scroll;
  }
}
</style>
