<template>
  <section class="parks">
    <div class="controls">
      Show:
      <select>
        <option>All</option>
        <option>Active</option>
        <option>Visited</option>
        <option>Not Visited</option>
        <option>None</option>
      </select>
    </div>
    <div class="park-list">
      <div class="park" v-for="park in parks">
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
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "Parks",
  setup() {
    const store = useStore();
    return {
      parks: computed(() => store.state.parks),
      trips: computed(() => store.state.trips),
      activeTrips: computed(() => store.state.activeTrips),
      icons: computed(() => store.state.icons),
    };
  },
  methods: {
    getGrayscaleStyle(park) {
      const active = this.trips
        .filter((trip) => this.activeTrips.includes(trip._id))
        .map((trip) => trip.parks)
        .flat()
        .includes(park.name);
      console.log(active);
      //   return active ? "" : "filter:grayscale(1)";
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
  background-color: #a1cceb;
  display: grid;
  grid-template-rows: auto auto;
  justify-content: space-around;
  overflow-y: scroll;
  .controls {
    display: grid;
  }
  .park-list {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-around;
    .park {
      max-width: 60px;
      padding: 3px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
