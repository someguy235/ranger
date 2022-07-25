<template>
  <div class="main">
    <div id="edit" v-if="token !== null">
      <v-form
        @submit.prevent="update"
        enctype="multipart/form-data"
        class="pb-6"
      >
        <v-container :style="{ 'overflow-y': scroll }">
          <v-row class="pt-6" no-gutters>
            <v-col>
              <v-text-field v-model="editTitle" label="title" required />
            </v-col>
          </v-row>
          <v-row class="dates pb-8" no-gutters>
            <v-col class="date">
              <input id="bDate" v-model="editBDate" type="date" required />
              <label for="bDate">begin date</label>
            </v-col>
            <v-col class="date">
              <input id="eDate" v-model="editEDate" type="date" required />
              <label for="eDate">end date</label>
            </v-col>
          </v-row>
          <v-row no-gutters>
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
          <v-row no-gutters>
            <v-col cols="7">
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
            <v-col cols="2" class="d-flex">
              <div
                :style="{ 'background-color': editColor }"
                class="swatch"
                @click="toggleShowColor"
              ></div>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-if="trip.kml" v-model="removeKml" label="remove" />
            </v-col>
          </v-row>
          <v-row v-if="showColor" class="pb-8" no-gutters>
            <v-col class="d-flex justify-center">
              <v-color-picker
                v-model="editColor"
                hide-inputs
                :modes="['rgb']"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
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
              <v-checkbox v-if="trip.img" v-model="removeImg" label="remove" />
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center" no-gutters>
            <v-col class="d-flex justify-center">
              <v-btn @click.prevent="toggleEdit(trip._id)">Cancel</v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn type="submit">Save</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ref } from "vue";

export default {
  name: "Edit",
  props: ["trip", "getTrips", "toggleEdit", "setSnackMsg"],
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
      editId: this.trip._id,
      editTitle: this.trip.title,
      editBDate: this.trip.bDate.substring(0, 10),
      editEDate: this.trip.eDate.substring(0, 10),
      editColor: this.trip.color,
      editParkIds: this.trip.parks,
      removeKml: false,
      removeImg: false,
      updateMsg: null,
      showColor: false,
      showUpdateMsg: false,
    };
  },
  computed: {
    ...mapState(["user", "token", "parks"]),
  },
  methods: {
    getParkNames(trip) {
      return trip.parks
        .map((parkId) => this.parks.filter((park) => park._id === parkId)[0])
        .map((park) => park.name)
        .join(", ");
    },
    toggleShowColor() {
      this.showColor = !this.showColor;
    },
    editTrip(id) {
      this.editId = id;
      const targetTrip = this.trips.filter((trip) => trip._id === id)[0];
      this.editTitle = targetTrip.title;
      this.editBDate = targetTrip.bDate.substring(0, 10);
      this.editEDate = targetTrip.eDate.substring(0, 10);
      this.editColor = targetTrip.color;
      this.editParkIds = targetTrip.parks;
    },
    async update() {
      const params = new FormData();
      params.append("id", this.editId);
      params.append("title", this.editTitle);
      params.append("bDate", this.editBDate);
      params.append("eDate", this.editEDate);
      params.append("color", this.editColor);
      params.append("parks", this.editParkIds);
      params.append("kml", this.$refs.kml.files[0]);
      params.append("removeKml", this.removeKml);
      params.append("image", this.$refs.image.files[0]);
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
        this.showUpdateMsg = true;
        this.editId = null;
        this.editTitle = null;
        this.editBDate = null;
        this.editEDate = null;
        this.editParkIds = [];
        this.setSnackMsg("update successful");
        this.getTrips();
        this.toggleEdit(this.trip._id);
      } else {
        this.setSnackMsg("something went wrong");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: auto minmax(250px, 500px) auto;
  grid-template-areas: ". main .";
  height: 100%;
  justify-content: center;
  padding-top: 3rem;
  #edit {
    background-color: white;
    grid-area: main;
    form {
      border: 1px solid grey;
      .dates {
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
      .swatch {
        border: 1px solid grey;
        height: 56px;
        width: 56px;
      }
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
