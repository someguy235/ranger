<template>
  <section class="parks">
    <div class="park" v-for="park in parks">
      <img
        :src="'./images/parks/' + park.image"
        :title="park.name"
        :style="getGrayscaleStyle(park)"
      />
    </div>
  </section>
</template>

// TODO: filter by visited/not visited
<script>
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
    };
  },
  methods: {
    getGrayscaleStyle(park) {
      const active = this.trips
        .filter((trip) => this.activeTrips.includes(trip._id))
        .map((trip) => trip.parks)
        .flat()
        .includes(park.name);
      //   return active ? "" : "filter:grayscale(1)";
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.parks {
  background-color: #a1cceb;
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: space-around;
  overflow-y: scroll;
  padding: 10px 10px;
}
</style>
