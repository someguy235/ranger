<template>
  <div class="content">
    <div class="content-row">
      <trips />
      <maps />
      <parks />
    </div>
    <div class="timeline-row">
      <v-container>
        <v-row>
          <v-col class="pa-12">
            <v-range-slider
              :ticks="getTripDates"
              :value="[0, 1]"
              min="0"
              max="3"
              :step="1"
              show-ticks="always"
              thumb-label="never"
              tick-size="2"
            >
              <!-- <template v-slot:thumb-label="{ modelValue }">test</template> -->
            </v-range-slider>
          </v-col>
        </v-row>
      </v-container>
      <!-- <timeline /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "@vue/reactivity";

import Trips from "../components/Trips.vue";
import Parks from "../components/Parks.vue";
import Maps from "../components/Maps.vue";

export default {
  name: "Home",
  data() {
    return {
      ticks: { 0: "zero", 1: "one", 2: "two", 3: "three" },
    };
  },
  components: {
    Trips,
    Parks,
    Maps,
  },
  computed: {
    ...mapState(["user", "tripList"]),
    ...mapGetters(["getTripDates"]),
    // tripDates() {
    //   console.log(this.tripList);
    //   if (this.tripList) return this.tripList.map((trip) => trip.bDate);
    // },
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    return {
      viewUser: computed(() => route.query?.user || store.state.user),
      // tripDates: computed(() => this.tripList.map((trip) => trip.bDate)),
    };
  },
  watch: {
    viewUser() {
      this.getTrips();
    },
  },
  methods: {
    ...mapMutations(["setUser", "setToken", "setTrips"]),
    async getTrips() {
      if (this.viewUser !== null) {
        const response = await fetch(
          `/ranger/api/trips?user=${this.viewUser}`,
          {
            method: "GET",
          }
        );
        const trips = await response.json();
        this.setTrips(trips);
      }
    },
    async getKml() {
      console.log("getKml()");
      const response = await fetch("/ranger/api/kml");
      const kml = await response.text;
      console.log(kml);
    },
  },
  beforeMount() {
    this.getTrips();
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-template-rows: calc(100% - 140px) 140px;
  .content-row {
    display: grid;
    grid-template-columns: 20% 60% 20%;
  }
  .timeline-row {
    // display: grid;
    .timeline {
      // background-color: #c2e5c4;
    }
  }
}
</style>
