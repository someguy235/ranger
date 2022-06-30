<template>
  <div class="main">
    <div class="content">
      <div class="content-row">
        <section class="trips">
          <trips :tripList="tripList" />
        </section>
        <section class="map">Maps</section>
        <section class="parks">Parks</section>
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

export default {
  name: "Home",
  components: {
    Trips,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    return {
      setUser: (user) => store.commit("setUser", user),
      setToken: (token) => store.commit("setToken", token),
      user: computed(() => store.state.user),
      viewUser: computed(() => route.query?.user || store.state.user),
    };
  },
  data() {
    return {
      name: "Home",
      tripList: [],
    };
  },
  watch: {
    viewUser(viewUser) {
      this.getTrips();
    },
  },
  methods: {
    async getTrips() {
      // TODO: add to store instead
      console.log("getTrips()");
      if (this.viewUser !== null) {
        const response = await fetch(
          `/ranger/api/trips?user=${this.viewUser}`,
          {
            method: "GET",
          }
        );
        const trips = await response.json();
        console.log(trips);
        this.tripList = trips;
      }
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
  height: 100%;
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
    .trips {
      background-color: #eba1a1;
      display: grid;
      overflow: scroll;
    }
    .map {
      background-color: #dad6b6;
    }
    .parks {
      background-color: #a1cceb;
    }
  }
  .timeline-row {
    display: grid;
    .timeline {
      background-color: #c2e5c4;
    }
  }
}
</style>
