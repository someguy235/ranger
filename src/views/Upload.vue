<template>
  <div class="main">
    <div id="upload" v-if="token !== null">
      <v-form @submit.prevent="upload" enctype="multipart/form-data">
        <v-container>
          <v-row class="pt-6">
            <v-col>
              <v-text-field v-model="title" label="title" required />
            </v-col>
          </v-row>
          <v-row class="dates">
            <v-col class="date">
              <input id="bDate" v-model="bDate" type="date" required />
              <label for="bDate">begin date</label>
            </v-col>
            <v-col class="date">
              <input id="eDate" v-model="eDate" type="date" required />
              <label for="eDate">end date</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                multiple
                v-model="selectedParkIds"
                :items="parks"
                item-title="name"
                item-value="_id"
                label="visited parks"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
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
                class="w-100 h-50"
                @click="toggleShowColor"
              ></div>
            </v-col>
          </v-row>
          <v-row v-if="showColor" class="mb-4">
            <v-col class="d-flex justify-center">
              <v-color-picker v-model="color" />
            </v-col>
          </v-row>
          <v-row>
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
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn type="submit">Upload</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <div>
        <v-snackbar v-model="uploadMsg">{{ uploadMsg }}</v-snackbar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ref } from "vue";
import Login from "../components/Login.vue";

export default {
  name: "Upload",
  props: ["getTrips", "toggleUpload"],
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
      title: "",
      bDate: "",
      eDate: "",
      color: null,
      selectedParkIds: [],
      uploadMsg: null,
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
      // TODO: file type validation
      this.uploadMsg = "";
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
        this.uploadMsg = "upload successful";
        this.title = "";
        this.bDate = "";
        this.eDate = "";
        this.selectedParkIds = [];
        // this.kml.value = null;
        // this.image.value = null;
        this.toggleUpload();
        this.getTrips();
      } else {
        this.uploadMsg = "something went wrong";
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
  padding-top: 3rem;
}
#title {
  align-items: center;
  display: grid;
  grid-area: title;
  justify-content: center;
}
#upload {
  background-color: white;

  display: grid;
  grid-area: main;
  form {
    border: 1px solid grey;
    justify-content: center;
    input {
      margin: 0;
      padding: 0;
    }
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
    .parks {
      column-gap: 5px;
      display: grid;

      grid-template-columns: 1fr 1fr;
    }
    select {
      display: grid;
    }
  }
}
</style>
