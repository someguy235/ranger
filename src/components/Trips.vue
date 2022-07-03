<template>
  <section class="trips">
    <div><button>All</button><button>None</button></div>
    <div v-for="trip in trips" class="trip">
      <div class="title">
        {{ trip.title }}
        <input
          type="checkbox"
          @change="toggleActiveTrip(trip.title)"
          :isChecked="getIsActive(trip.title)"
        />
      </div>
      <div class="dates">
        {{ trip.bDate.substr(0, 10) }} - {{ trip.eDate.substr(0, 10) }}
      </div>
      <div class="miles">xxx miles</div>
      <div class="parks">
        <div v-for="park in trip.parks">
          <img :src="'./images/parks/' + getParkFilename(park)" :title="park" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "Trips",
  setup() {
    const store = useStore();
    return {
      parks: computed(() => store.state.parks),
      trips: computed(() => store.state.trips),
      activeTripTitles: computed(() => store.state.activeTripTitles),
      toggleActiveTrip: (title) => store.commit("toggleActiveTrip", title),
    };
  },
  methods: {
    getParkFilename(name) {
      const park = this.parks.filter((p) => p.name === name)[0];
      return park.image;
    },
    getIsActive(title) {
      return this.activeTripTitles.includes(title);
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
