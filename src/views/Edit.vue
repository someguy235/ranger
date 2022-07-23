<template>
  <div class="main">
    <div id="login" v-if="token === null">
      <login />
    </div>
    <div id="edit" v-if="token !== null">
      <div id="trips" class="pa-2">
        <v-card elevation="3" v-for="trip in trips" class="trip mb-2 pa-3">
          <v-container class="display" v-if="editId !== trip._id">
            <v-row>
              <v-col>Title: {{ trip.title }}</v-col>
            </v-row>
            <v-row>
              <v-col> begin: {{ trip.bDate.substring(0, 10) }} </v-col>
              <v-col> end: {{ trip.eDate.substring(0, 10) }} </v-col>
            </v-row>
            <v-row>
              <v-col> parks: {{ getParkNames(trip) }} </v-col>
            </v-row>
            <v-row>
              <v-col v-if="trip.kml">
                <v-icon icon="mdi-map"></v-icon>
                .kml
              </v-col>
              <v-col v-if="trip.image">
                <v-icon icon="mdi-camera"></v-icon>
                img
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center pt-6">
                <v-btn @click="editTrip(trip._id)">edit</v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-form
            @submit.prevent="update"
            enctype="multipart/form-data"
            class="edit"
            v-if="editId === trip._id"
          >
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="editTitle" label="title" required />
                </v-col>
              </v-row>
              <v-row class="dates">
                <v-col class="date">
                  <input id="bDate" v-model="editBDate" type="date" required />
                  <label for="bDate">begin date</label>
                </v-col>
                <v-col class="date">
                  <input id="eDate" v-model="editEDate" type="date" required />
                  <label for="eDate">end date</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    multiple
                    v-model="editParkIds"
                    :items="parks"
                    item-title="name"
                    item-value="_id"
                    label="visited parks"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="9">
                  <v-file-input
                    id="kml-input"
                    ref="kml"
                    name="kml"
                    label="kml file"
                    prepend-icon="mdi-map"
                    accept=".kml"
                    :disabled="removeKml"
                  />
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-if="trip.kml"
                    v-model="removeKml"
                    label="remove"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="9">
                  <v-file-input
                    id="img-input"
                    ref="image"
                    name="image"
                    label="cover image"
                    prepend-icon="mdi-camera"
                    accept="image/*"
                    :disabled="removeImg"
                  />
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-if="trip.img"
                    v-model="removeImg"
                    label="remove"
                  />
                </v-col>
              </v-row>
              <v-row class="d-flex justify-center">
                <v-col class="d-flex justify-center">
                  <v-btn @click="cancelEdit(trip._id)" type="cancel"
                    >Cancel
                  </v-btn>
                </v-col>
                <v-col class="d-flex justify-center">
                  <v-btn type="submit">Save</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <div>
            <v-snackbar v-model="showUpdateMsg">{{ updateMsg }}</v-snackbar>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: add this func to Trips component?
import { ref } from "vue";
import { mapState } from "vuex";
import Login from "../components/Login.vue";

export default {
  components: {
    Login,
  },
  setup() {
    const kml = ref(null);
    const image = ref(null);
    return {
      kml,
      image,
    };
  },
  data() {
    return {
      trips: [],
      editId: null,
      editTitle: null,
      editBDate: null,
      editEDate: null,
      editParkIds: [],
      removeKml: false,
      removeImg: false,
      updateMsg: null,
      showUpdateMsg: false,
    };
  },
  computed: {
    ...mapState(["user", "token", "parks"]),
  },
  watch: {
    user() {
      this.getTrips();
    },
  },
  methods: {
    async getTrips() {
      if (this.user !== null) {
        const response = await fetch(`/ranger/api/trips?user=${this.user}`, {
          method: "GET",
        });
        const trips = await response.json();
        this.trips = trips;
      }
    },
    getParkNames(trip) {
      return trip.parks
        .map((parkId) => this.parks.filter((park) => park._id === parkId)[0])
        .map((park) => park.name)
        .join(", ");
    },
    editTrip(id) {
      this.editId = id;
      const targetTrip = this.trips.filter((trip) => trip._id === id)[0];
      this.editTitle = targetTrip.title;
      this.editBDate = targetTrip.bDate.substring(0, 10);
      this.editEDate = targetTrip.eDate.substring(0, 10);
      this.editParkIds = targetTrip.parks;
    },
    cancelEdit() {
      this.editId = null;
    },
    async update() {
      this.uploadMsg = "";
      const params = new FormData();
      params.append("id", this.editId);
      params.append("title", this.editTitle);
      params.append("bDate", this.editBDate);
      params.append("eDate", this.editEDate);
      params.append("parks", this.editParkIds);
      params.append("kml", this.$refs.kml[0].files[0]);
      params.append("removeKml", this.removeKml);
      params.append("image", this.$refs.image[0].files[0]);
      params.append("removeImg", this.removeImg);

      const response = await fetch("/ranger/api/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.token,
        },
        body: params,
      });

      const r = await response.status;
      if (r === 200) {
        this.updateMsg = "update successful";
        this.showUpdateMsg = true;
        this.editId = null;
        this.editTitle = null;
        this.editBDate = null;
        this.editEDate = null;
        this.editParkIds = [];
        this.getTrips();
      } else {
        this.updateMsg = "something went wrong";
        // TODO: really need this?
        this.showUpdateMsg = true;
      }
    },

    // getImgData(data) {
    //   const buffer = Buffer.from(data);
    //   const string = "data:image/jpg;base64," + buffer.toString("base64");
    //   return string;
    // },
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
  #edit {
    display: grid;
    grid-area: main;
    grid-template-columns: 100%;
    justify-content: center;
    #trips {
      overflow: scroll;
      .trip {
        .dates {
          margin-bottom: 20px;
          .date {
            align-items: center;
            display: flex;
            flex-direction: column;
            input[type="date"] {
              align-items: center;
              align-self: center;
              border-bottom: 1px solid;
            }
          }
        }
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
