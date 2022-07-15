<template>
  <section class="trips">
    <div><v-btn>All</v-btn><v-btn>None</v-btn></div>
    <div v-for="trip in trips" class="trip">
      <div class="title">
        {{ trip.title }}
        <input
          type="checkbox"
          @change="toggleActiveTrip(trip._id)"
          :isChecked="getIsActive(trip._id)"
        />
      </div>
      <div class="dates">
        {{ trip.bDate.substr(0, 10) }} - {{ trip.eDate.substr(0, 10) }}
      </div>
      <div class="miles" v-if="trip.distance">{{ trip.distance }} miles</div>
      <div class="parks">
        <div v-for="parkId in trip.parks">
          <img :src="getParkFileData(parkId)" :title="getParkName(parkId)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// TODO: trip path color, and persist on change
// TODO: incorporate trip cover photo
// import { computed } from "@vue/reactivity";
import { mapGetters, mapState, useStore } from "vuex";

export default {
  name: "Trips",
  setup() {
    const store = useStore();
    return {
      toggleActiveTrip: (id) => store.commit("toggleActiveTrip", id),
    };
  },
  computed: {
    ...mapGetters(["getParkFileData"]),
    ...mapState({
      parks: (state) => state.parks,
      trips: (state) => state.trips,
      activeTrips: (state) => state.activeTrips,
    }),
  },
  methods: {
    getParkName(id) {
      const park = this.parks.filter((p) => p._id === id)[0];
      return park.name;
    },
    getParkFilename(id) {
      const park = this.parks.filter((p) => p._id === id)[0];
      return park.image;
    },
    getIsActive(id) {
      return this.activeTrips.includes(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.trips {
  display: grid;
  grid-auto-rows: minmax(min-content, max-content);
  overflow-y: scroll;
  padding: 0 10px;
  .trip {
    border: 1px solid grey;
    display: grid;
    grid-auto-rows: minmax(min-content, max-content);
    margin-top: 1rem;
    padding: 10px;
    .title {
      font-size: 1.6rem;
    }
    .parks {
      display: grid;
      grid-template-columns: auto auto auto;
      justify-content: space-around;
      margin-top: 10px;
      div {
        font-size: 0.8rem;
        max-width: 60px;
        padding: 3px;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
