<template>
  <div class="content">
    <div class="content-row">
      <trips
        :toggleUpload="toggleUpload"
        :toggleEdit="toggleEdit"
        :viewUser="viewUser"
      />
      <maps />
      <parks />
    </div>
    <v-dialog v-model="showUpload">
      <upload
        :getTrips="getTrips"
        :toggleUpload="toggleUpload"
        :setSnackMsg="setSnackMsg"
      />
    </v-dialog>
    <v-dialog v-model="showEdit">
      <edit
        :getTrips="getTrips"
        :toggleEdit="toggleEdit"
        :setSnackMsg="setSnackMsg"
        :trip="editTrip"
      />
    </v-dialog>
    <v-snackbar v-model="showSnackMsg" class="text-center">{{
      snackMsg
    }}</v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "@vue/reactivity";

import Trips from "../components/Trips.vue";
import Parks from "../components/Parks.vue";
import Maps from "../components/Maps.vue";
import Upload from "./Upload.vue";
import Edit from "./Edit.vue";

export default {
  name: "Home",
  data() {
    return {
      showUpload: false,
      showEdit: false,
      editTrip: null,
      snackMsg: null,
      showSnackMsg: false,
    };
  },
  components: {
    Trips,
    Parks,
    Maps,
    Upload,
    Edit,
  },
  computed: {
    ...mapState(["user", "tripList"]),
    ...mapGetters(["getTripDates"]),
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
    snackMsg() {
      this.showSnackMsg = true;
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
    toggleUpload() {
      this.showUpload = !this.showUpload;
    },
    toggleEdit(trip) {
      this.editTrip = trip;
      this.showEdit = !this.showEdit;
    },
    setSnackMsg(msg) {
      this.snackMsg = msg;
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
  grid-template-rows: 100%;
  margin-bottom: 1rem;
  .content-row {
    display: grid;
    grid-template-columns: 20% 60% 20%;
  }
}
</style>
