<template>
  <div class="content">
    <div class="content-row">
      <trips />
      <maps />
      <parks />
    </div>
    <div class="timeline-row">
      <div class="timeline">Timeline</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "@vue/reactivity";

import Trips from "../components/Trips.vue";
import Parks from "../components/Parks.vue";
import Maps from "../components/Maps.vue";

export default {
  name: "Home",
  components: {
    Trips,
    Parks,
    Maps,
  },
  computed: {
    ...mapState(["user", "tripList"]),
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    return {
      viewUser: computed(() => route.query?.user || store.state.user),
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
    display: grid;
    .timeline {
      background-color: #c2e5c4;
    }
  }
}
</style>
