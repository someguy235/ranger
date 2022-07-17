<template>
  <section class="parks">
    <div class="park-controls d-flex align-center px-2">
      <v-select
        density="compact"
        variant="outlined"
        :items="showOptions"
        label="Show"
      >
      </v-select>
    </div>
    <div class="park-list justify-center">
      <div v-for="park in parks" class="d-flex pa-1">
        <img
          :src="getParkFileData(park._id)"
          :title="park.name"
          :style="getGrayscaleStyle(park)"
        />
      </div>
    </div>
  </section>
</template>

<script>
// TODO: toggle map markers
// TODO: filter by visited/not visited
// TODO: add marker to map on badge mouseover
import { mapState, mapGetters } from "vuex";

export default {
  name: "Parks",
  data() {
    return {
      showOptions: ["All", "Active", "Visited", "Not Visited", "None"],
    };
  },
  computed: {
    ...mapGetters(["getParkFileData"]),
    ...mapState(["parks", "trips", "icons", "activeTrips"]),
  },
  methods: {
    getGrayscaleStyle(park) {
      const active = this.trips
        .filter((trip) => this.activeTrips.includes(trip._id))
        .map((trip) => trip.parks)
        .flat()
        .includes(park._id);
      // console.log(active);
      return active ? "" : "filter:grayscale(1)";
      // return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.parks {
  display: grid;
  grid-template-rows: 75px auto;
  overflow-y: scroll;
  .park-controls {
    .v-input {
      grid-template-rows: 100% 0 !important;
    }
  }
  .park-list {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
  }
}
</style>
