<template>
  <div class="main">
    <div id="upload" v-if="token !== null">
      <v-form
        @submit.prevent="upload"
        enctype="multipart/form-data"
        class="pb-6"
      >
        <v-container :style="{ 'overflow-y': scroll }">
          <v-row class="pt-6" no-gutters>
            <v-col>
              <v-text-field v-model="title" label="title" required />
            </v-col>
          </v-row>
          <v-row class="dates pb-6" no-gutters>
            <v-col class="date">
              <input id="bDate" v-model="bDate" type="date" required />
              <label for="bDate">begin date</label>
            </v-col>
            <v-col class="date">
              <input id="eDate" v-model="eDate" type="date" required />
              <label for="eDate">end date</label>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-select
                multiple
                v-model="selectedParkIds"
                :items="parks"
                item-title="name"
                item-value="_id"
                label="visited parks"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="10">
              <v-file-input
                id="kml-input"
                ref="kml"
                name="kml"
                label="kml file"
                prepend-icon="mdi-map"
                accept=".kml"
              />
            </v-col>
            <v-col cols="2" class="d-flex">
              <div
                :style="{ 'background-color': color }"
                class="swatch"
                @click="toggleShowColor"
              ></div>
            </v-col>
          </v-row>
          <v-row v-if="showColor" class="mb-4" no-gutters>
            <v-col class="d-flex justify-center">
              <v-color-picker v-model="color" hide-inputs :modes="['rgb']" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-file-input
                id="img-input"
                ref="image"
                name="image"
                label="cover image"
                prepend-icon="mdi-camera"
                accept="image/*"
              />
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center" no-gutters>
            <v-col class="d-flex justify-center">
              <v-btn @click.prevent="toggleUpload">Cancel</v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn type="submit">Upload</v-btn>
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
  name: "Upload",
  props: ["getTrips", "toggleUpload", "setSnackMsg"],
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
      title: "",
      bDate: "",
      eDate: "",
      color: null,
      selectedParkIds: [],
      showColor: false,
    };
  },
  computed: {
    ...mapState(["user", "token", "parks"]),
  },
  methods: {
    togglePark(newId) {
      if (this.selectedParkIds.includes(newId)) {
        this.selectedParkIds = this.selectedParkIds.filter((id) => {
          return id !== newId;
        });
      } else {
        const newParkIds = this.selectedParkIds.slice();
        newParkIds.push(newId);
        this.selectedParkIds = newParkIds;
      }
    },
    toggleShowColor() {
      this.showColor = !this.showColor;
    },
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    async upload() {
      const params = new FormData();
      params.append("title", this.title);
      params.append("bDate", this.bDate);
      params.append("eDate", this.eDate);
      params.append("color", this.color);
      params.append("parks", this.selectedParkIds);
      params.append("kml", this.kml.files[0]);
      params.append("image", this.image.files[0]);

      const response = await fetch("/ranger/api/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.token,
        },
        body: params,
      });

      const r = await response.status;

      if (r === 200) {
        this.title = "";
        this.bDate = "";
        this.eDate = "";
        this.selectedParkIds = [];
        this.setSnackMsg("upload successful");
        this.getTrips();
        this.toggleUpload();
      } else {
        this.setSnackMsg("something went wrong");
      }
    },
  },
  mounted() {
    this.color = this.getRandomColor();
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
  overflow-y: scroll;
  padding-top: 3rem;
  #upload {
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
        height: 56px;
        width: 56px;
      }
    }
  }
}
</style>
