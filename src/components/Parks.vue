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
      activeTripTitles: computed(() => store.state.activeTripTitles),
    };
  },
  methods: {
    getGrayscaleStyle(park) {
      const active = this.trips
        .filter((trip) => this.activeTripTitles.includes(trip.title))
        .map((trip) => trip.parks)
        .flat()
        .includes(park.name);
      return active ? "" : "filter:grayscale(1)";
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
