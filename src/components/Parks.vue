<template>
  <section class="parks">
    <div class="park-controls d-flex align-center px-2">
      <v-select
        density="compact"
        variant="outlined"
        label="Show"
        :items="showOptions"
        v-model="showOption"
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
// TODO: add marker to map on badge mouseover
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Parks",
  data() {
    return {
      showOptions: ["All", "Active", "Visited", "Not Visited", "None"],
      showOption: "Active",
    };
  },
  watch: {
    showOption(newVal) {
      this.setActiveParksFilter(newVal);
    },
  },
  computed: {
    ...mapGetters(["getParkFileData"]),
    ...mapState([
      "parks",
      "trips",
      "icons",
      "activeTrips",
      "activeParks",
      "activeParksFilter",
    ]),
  },
  methods: {
    ...mapActions(["setActiveParksFilter"]),
    getGrayscaleStyle(park) {
      const active = this.activeParks.includes(park._id);
      return active ? "" : "filter:grayscale(1);opacity:.2;";
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
    img {
      transition: all 0.3s;
    }
  }
}
</style>
