<template>
  <section class="map">
    <div id="mapContainer"></div>
    <button @click="test">Test</button>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import KML from "../assets/js/L.KML";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "Maps",
  setup() {
    const store = useStore();
    return {
      trips: computed(() => store.state.trips),
      activeTripTitles: computed(() => store.state.activeTripTitles),
    };
  },
  data() {
    return {
      center: [37.7749, -122.4194],
      mapDiv: null,
    };
  },
  methods: {
    setupLeafletMap: function () {
      this.mapDiv = L.map("mapContainer").setView(this.center, 13);
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          accessToken: "",
        }
      ).addTo(this.mapDiv);
    },
    test: function () {
      this.trips.map((trip) => {
        if (trip.kml) {
          var kmlString = new TextDecoder().decode(
            new Uint8Array(trip.kml.data)
          );

          const parser = new DOMParser();
          const kml = parser.parseFromString(kmlString, "text/xml");
          const kmlLayer = new L.KML(kml);
          this.mapDiv.addLayer(kmlLayer);
        }
      });
    },
  },
  mounted() {
    this.setupLeafletMap();
  },
};
</script>

<style lang="scss" scoped>
.map {
  background-color: #dad6b6;
}
#mapContainer {
  width: 100%;
  height: 90%;
}
</style>
