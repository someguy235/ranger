<template>
  <div class="main">
    <div id="title">edit page ({{ user }})</div>
    <div id="login" v-if="token === null">
      <login />
    </div>
    <div id="edit" v-if="token !== null">
      <form @submit.prevent="getTrips">
        <button type="submit">Get Trips</button>
      </form>
      <div v-for="trip in trips" class="trip">
        <div class="trip">
          {{ trip.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Login from "./components/Login.vue";

export default {
  components: {
    Login,
  },
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.state.user),
      token: computed(() => store.state.token),
    };
  },
  data() {
    return {
      trips: [],
    };
  },
  methods: {
    async getTrips() {
      console.log(`getTrips(${this.user})`);
      if (this.user !== null) {
        const response = await fetch(`/ranger/api/trips?user=${this.user}`, {
          method: "GET",
        });
        const trips = await response.json();
        this.trips = trips;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 10% 90%;
  grid-template-areas:
    ". title ."
    ". main .";
  height: 100%;
  justify-content: center;
}
#title {
  align-items: center;
  display: grid;
  grid-area: title;
  justify-content: center;
}
#edit {
  display: grid;
  grid-area: main;
  justify-content: center;
}
</style>
