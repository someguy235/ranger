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
import { map } from "rxjs";

export default {
  name: "Maps",
  setup() {
    const store = useStore();
    return {
      trips: computed(() => store.state.trips),
      activeTrips: computed(() => store.state.activeTrips),
    };
  },
  data() {
    return {
      mapDiv: null,
      layers: {},
      defaultCenter: [39.8283, -98.5795],
      defaultZoom: 4,
    };
  },
  methods: {
    setupLeafletMap: function () {
      this.mapDiv = L.map("mapContainer").setView(
        this.defaultCenter,
        this.defaultZoom
      );
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
    findBounds: function (mapBounds, tripBounds) {
      if (!mapBounds) {
        return {
          minLat: tripBounds.minLat,
          maxLat: tripBounds.maxLat,
          minLon: tripBounds.minLon,
          maxLon: tripBounds.maxLon,
        };
      } else {
        return {
          minLat: Math.min(tripBounds.minLat, mapBounds.minLat),
          maxLat: Math.max(tripBounds.maxLat, mapBounds.maxLat),
          minLon: Math.min(tripBounds.minLon, mapBounds.minLon),
          maxLon: Math.max(tripBounds.maxLon, mapBounds.maxLon),
        };
      }
    },
  },
  watch: {
    "$store.state.activeTrips": {
      handler(newVal) {
        let mapBounds = null;
        this.trips.map((trip) => {
          if (trip.kml) {
            if (this.activeTrips.includes(trip._id)) {
              mapBounds = this.findBounds(mapBounds, trip.bounds);
              if (!Object.keys(this.layers).includes(trip._id)) {
                const parser = new DOMParser();
                const kml = parser.parseFromString(trip.kml, "text/xml");
                const kmlLayer = new L.KML(kml);
                this.layers[trip._id] = kmlLayer;
                this.mapDiv.addLayer(kmlLayer);
              }
            } else {
              if (Object.keys(this.layers).includes(trip._id)) {
                this.mapDiv.removeLayer(this.layers[trip._id]);
                delete this.layers[trip._id];
              }
            }
          }
        });
        if (mapBounds) {
          this.mapDiv.fitBounds([
            [mapBounds.minLat, mapBounds.minLon],
            [mapBounds.maxLat, mapBounds.maxLon],
          ]);
        } else {
          this.mapDiv.setView(this.defaultCenter, this.defaultZoom);
        }
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
