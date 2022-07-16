<template>
  <section class="parks">
    <v-container>
      <v-row>
        <v-col>
          <v-select variant="outlined" :items="showOptions" label="Show">
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col v-for="park in parks" class="d-flex justify-center pa-1">
          <img
            :src="getParkFileData(park._id)"
            :title="park.name"
            :style="getGrayscaleStyle(park)"
          />
          <!-- {{ park.name }} -->
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
// TODO: toggle map markers
// TODO: filter by visited/not visited
// TODO: add marker to map on badge mouseover
import { mapState } from "vuex";

export default {
  name: "Parks",
  data() {
    return {
      showOptions: ["All", "Active", "Visited", "Not Visited", "None"],
    };
  },
  computed: {
    ...mapState(["parks", "trips", "icons", "activeTrips"]),
  },
  methods: {
    getGrayscaleStyle(park) {
      const active = this.trips
        .filter((trip) => this.activeTrips.includes(trip._id))
        .map((trip) => trip.parks)
        .flat()
        .includes(park.name);
      console.log(active);
      // return active ? "" : "filter:grayscale(1)";
      return "";
    },
    getParkFileData(id) {
      const park = this.parks.filter((p) => p._id === id)[0];
      const image = park.image;
      const data = this.icons[image];
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.parks {
  overflow-y: scroll;
}
</style>
