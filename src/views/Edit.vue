<template>
  <div class="main">
    <div id="title">edit page ({{ user }})</div>
    <div id="login" v-if="token === null">
      <login />
    </div>
    <div id="edit" v-if="token !== null">
      <!-- <form @submit.prevent="getTrips">
        <button type="submit">Get Trips</button>
      </form> -->
      <div id="trips">
        <div v-for="trip in trips" class="trip">
          <div>Title: {{ trip.title }}</div>
          <div>id: {{ trip._id }}</div>
          <div>bDate: {{ trip.bDate }}</div>
          <div>eDate: {{ trip.eDate }}</div>
          <div>parks: {{ trip.parks }}</div>
          <!-- <div>kml: {{ trip.kml }}</div> -->
          <div>
            <img :src="`${getImgData(trip.image.data)}`" />
          </div>
          <div><button>edit</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Login from "../components/Login.vue";

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
  watch: {
    user(user) {
      this.getTrips();
    },
  },
  methods: {
    async getTrips() {
      console.log("getTrips()");
      console.log(this.user);
      console.log("null");
      console.log(null);
      console.log(this.user !== null);
      if (this.user !== null) {
        const response = await fetch(`/ranger/api/trips?user=${this.user}`, {
          method: "GET",
        });
        const trips = await response.json();
        console.log(trips);
        this.trips = trips;
      }
    },
    getImgData(data) {
      const buffer = Buffer.from(data);
      const string = "data:image/jpg;base64," + buffer.toString("base64");
      return string;
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
  grid-template-columns: 100%;
  justify-content: center;
}
#trips {
  display: grid;
  overflow: scroll;
}
.trip {
  display: grid;
  img {
    max-width: 100%;
  }
}
</style>
