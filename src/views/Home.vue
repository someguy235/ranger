<template>
  <div class="content">
    <div class="content-row">
      <trips
        :toggleUpload="toggleUpload"
        :toggleEdit="toggleEdit"
        :viewUser="viewUser"
      />
      <maps :viewUser="viewUser" />
      <parks />
    </div>
    <v-dialog v-model="showUpload">
      <upload
        :getTrips="getTrips"
        :toggleUpload="toggleUpload"
        :setSnackMsg="setSnackMsg"
        :pushData="pushData"
      />
    </v-dialog>
    <v-dialog v-model="showEdit">
      <edit
        :getTrips="getTrips"
        :toggleEdit="toggleEdit"
        :toggleConfirmDelete="toggleConfirmDelete"
        :setSnackMsg="setSnackMsg"
        :trip="editTrip"
        :pushData="pushData"
      />
    </v-dialog>
    <v-dialog v-model="showConfirmDelete">
      <div id="delete">
        <v-form @submit.prevent="deleteTrip">
          <v-container>
            <v-row>
              <v-col>Delete {{ editTrip.title }}?</v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click.prevent="toggleConfirmDelete">Cancel</v-btn>
              </v-col>
              <v-col> <v-btn type="submit">Confirm</v-btn> </v-col>
            </v-row>
          </v-container>
        </v-form>
      </div>
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
      showConfirmDelete: false,
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
    ...mapState(["user", "token", "tripList"]),
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
    toggleConfirmDelete() {
      this.showConfirmDelete = !this.showConfirmDelete;
    },
    setSnackMsg(msg) {
      this.snackMsg = msg;
    },
    async deleteTrip() {
      const res = await fetch("/ranger/api/delete/" + this.editTrip._id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.token,
        },
      });
      const status = await res.status;

      if (status === 200) {
        if (this.showEdit) this.toggleEdit(this.editTrip._id);
        if (this.showConfirmDelete) this.toggleConfirmDelete();
        this.setSnackMsg("delete successful");
        this.getTrips();
      } else if (status === 401) {
        this.setUser(null);
        this.setToken(null);
        localStorage.setItem("authToken", null);
        localStorage.setItem("authUser", null);
        this.setSnackMsg("login expired");
      } else {
        this.setSnackMsg("something went wrong");
      }
    },
    async pushData(params) {
      const response = await fetch("/ranger/api/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.token,
        },
        body: params,
      });

      const res = await response;
      const status = res.status;
      const json = await res.json();

      if (this.showUpload) this.toggleUpload();
      if (this.showEdit) this.toggleEdit(this.editTrip._id);

      if (status === 200) {
        this.setSnackMsg("update successful");
        this.getTrips();
        if (json.newAuth) {
          this.setToken(json.newAuth);
          localStorage.setItem("authToken", json.newAuth);
        }
        return 200;
      } else if (status === 401) {
        this.setUser(null);
        this.setToken(null);
        localStorage.setItem("authToken", null);
        localStorage.setItem("authUser", null);
        this.setSnackMsg("login expired");
      } else {
        this.setSnackMsg("something went wrong");
      }
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
#delete {
  background-color: white;
  form {
    border: 1px solid grey;
  }
}
</style>
