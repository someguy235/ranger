<template>
  <div class="main">
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
  </div>
</template>

<script>
import { useStore } from "vuex";
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
  setup() {
    const store = useStore();
    const route = useRoute();
    return {
      setUser: (user) => store.commit("setUser", user),
      setToken: (token) => store.commit("setToken", token),
      user: computed(() => store.state.user),
      viewUser: computed(() => route.query?.user || store.state.user),
      setTrips: (trips) => store.commit("setTrips", trips),
      tripList: computed(() => store.state.trips),
    };
  },
  data() {
    return {
      name: "Home",
    };
  },
  watch: {
    viewUser() {
      this.getTrips();
    },
  },
  methods: {
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
.main {
  display: grid;
  grid-template-rows: minmax(400px, 800px);
}
.content {
  background-color: #f5f5f5;
  display: grid;
  grid-template-rows: auto 100px;

  .content-row {
    display: grid;
    grid-template-columns:
      minmax(20%, 300px)
      minmax(60%, 1400px)
      minmax(20%, 300px);
    overflow-y: scroll;
  }
  .timeline-row {
    display: grid;
    .timeline {
      background-color: #c2e5c4;
    }
  }
}
</style>
