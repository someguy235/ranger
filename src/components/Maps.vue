<template>
  <section class="map">
    <div id="mapContainer"></div>
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
      mapDiv: null,
      layers: {},
    };
  },
  methods: {
    setupLeafletMap: function () {
      this.mapDiv = L.map("mapContainer").setView([39.8283, -98.5795], 4);
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          accessToken:
            "pk.eyJ1Ijoic29tZWd1eTIzNSIsImEiOiJjbDU1cm53Y2cwcTVhM2RsOHRhcDgwd2k1In0.tujS3dsElV1hJHylnYQnAQ",
        }
      ).addTo(this.mapDiv);
    },
  },
  watch: {
    "$store.state.activeTripTitles": {
      handler(newVal) {
        this.trips.map((trip) => {
          if (trip.kml) {
            if (this.activeTripTitles.includes(trip.title)) {
              if (!Object.keys(this.layers).includes(trip.title)) {
                const parser = new DOMParser();
                const kml = parser.parseFromString(trip.kml, "text/xml");
                const kmlLayer = new L.KML(kml);
                this.layers[trip.title] = kmlLayer;
                this.mapDiv.addLayer(kmlLayer);
              }
            } else {
              if (Object.keys(this.layers).includes(trip.title)) {
                this.mapDiv.removeLayer(this.layers[trip.title]);
                delete this.layers[trip.title];
              }
            }
          }
        });
      },
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
  height: 100%;
}
</style>
