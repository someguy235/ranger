<template>
  <div class="main">
    <div id="upload">
      <v-form
        @submit.prevent="upload"
        enctype="multipart/form-data"
        class="pb-6"
      >
        <v-container>
          <v-row class="pt-6" no-gutters>
            <v-col>
              <v-text-field
                v-model="title"
                label="title"
                :rules="rules.title"
              />
            </v-col>
          </v-row>
          <v-row class="dates pb-6" no-gutters>
            <v-col class="date">
              <input id="bDate" v-model="bDate" type="date" />
              <label for="bDate">begin date</label>
              <label v-if="bDateInvalid" class="required">Required</label>
            </v-col>
            <v-col class="date">
              <input id="eDate" v-model="eDate" type="date" />
              <label for="eDate">end date</label>
              <label v-if="eDateInvalid" class="required">Required</label>
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
                :rules="rules.parks"
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
  props: ["toggleUpload", "pushData"],
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
      bDateInvalid: false,
      eDate: "",
      eDateInvalid: false,
      color: null,
      selectedParkIds: [],
      showColor: false,
      rules: {
        title: [(value) => !!value || "Required"],
        parks: [(v) => v.length > 0 || "At least one park must be selected"],
      },
    };
  },
  computed: {
    ...mapState(["parks"]),
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
    validateDate(date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj)) return false;
      return true;
    },
    async upload() {
      this.eDateInvalid = false;
      this.bDateInvalid = false;
      if (!this.validateDate(this.bDate)) this.bDateInvalid = true;
      if (!this.validateDate(this.eDate)) this.eDateInvalid = true;
      if (
        this.bDateInvalid ||
        this.eDateInvalid ||
        this.title === "" ||
        this.selectedParkIds.length === 0
      )
        return;

      const params = new FormData();
      params.append("title", this.title);
      params.append("bDate", this.bDate);
      params.append("eDate", this.eDate);
      params.append("color", this.color);
      params.append("parks", this.selectedParkIds);
      params.append("kml", this.kml.files[0]);
      params.append("image", this.image.files[0]);

      const status = await this.pushData(params);

      if (status === 200) {
        this.title = "";
        this.bDate = "";
        this.eDate = "";
        this.selectedParkIds = [];
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
          .required {
            font-size: 0.8rem;
            color: rgb(176, 0, 32);
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
