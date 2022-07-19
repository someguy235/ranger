<template>
  <section class="map">
    <div id="mapContainer"></div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// eslint-disable-next-line
import KML from "../assets/js/L.KML";
import { toRaw } from "vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "Maps",
  data() {
    return {
      map: null,
      layers: {},
      markers: {},
      defaultCenter: [39.8283, -98.5795],
      defaultZoom: 4,
    };
  },
  computed: {
    ...mapGetters(["getParkFileData"]),
    ...mapState(["parks", "trips", "icons", "activeTrips", "activeParks"]),
  },
  methods: {
    setupLeafletMap: function () {
      const map = L.map("mapContainer").setView(
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
      ).addTo(map);
      this.map = map;
    },
    findBounds: function (mapBounds, tripBounds) {
      if (!tripBounds) return mapBounds;
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
      handler() {
        let mapBounds = null;
        const map = toRaw(this.map);
        const layers = toRaw(this.layers);

        // Add/remove kml routes based on active trips
        this.trips.map((trip) => {
          if (this.activeTrips.includes(trip._id)) {
            mapBounds = this.findBounds(mapBounds, trip.bounds);
            if (trip.kml) {
              if (!Object.keys(layers).includes(trip._id)) {
                const parser = new DOMParser();
                const kml = parser.parseFromString(trip.kml, "text/xml");
                const kmlLayer = new L.KML(kml);
                layers[trip._id] = kmlLayer;
                map.addLayer(kmlLayer);
              }
            }
          } else {
            if (Object.keys(layers).includes(trip._id)) {
              map.removeLayer(layers[trip._id]);
              delete layers[trip._id];
            }
          }
        });

        // Zoom map to fit active trips
        if (mapBounds) {
          map.fitBounds([
            [mapBounds.minLat, mapBounds.minLon],
            [mapBounds.maxLat, mapBounds.maxLon],
          ]);
          if (map.getZoom() > 10) map.setZoom(10);
        } else {
          map.setView(this.defaultCenter, this.defaultZoom);
        }

        this.layers = layers;
      },
    },
    "$store.state.activeParks": {
      handler() {
        const map = toRaw(this.map);
        const markers = toRaw(this.markers);

        this.parks.map((park) => {
          if (this.activeParks.includes(park._id)) {
            if (!Object.keys(markers).includes(park._id)) {
              const marker = L.marker([park.lat, park.lon], {
                icon: L.icon({
                  iconUrl: this.getParkFileData(park._id),
                  iconSize: [28, 42],
                }),
              }).bindTooltip(park.name);
              markers[park._id] = marker;
              map.addLayer(marker);
            }
          } else if (Object.keys(markers).includes(park._id)) {
            map.removeLayer(markers[park._id]);
            delete markers[park._id];
          }
        });

        this.markers = markers;
      },
    },
  },
  mounted() {
    this.setupLeafletMap();
  },
};
</script>

<style lang="scss" scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}
</style>
