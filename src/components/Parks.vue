<template>
  <section class="parks">
    <div class="park" v-for="park in parks">
      <img
        :src="'./images/parks/' + park.image"
        :title="park.title"
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
    };
  },
  methods: {
    getGrayscaleStyle(park) {
      if (!this.trips) return "";
      const active = this.trips.filter((trip) => {
        return trip.parks.includes(park.name);
      });
      return active.length ? "" : "filter:grayscale(1)";
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
