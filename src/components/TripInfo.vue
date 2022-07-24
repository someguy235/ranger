<template>
  <v-row>
    <v-col class="trip-info pa-3">
      <v-row no-gutters class="px-3">
        <v-col class="d-flex align-center">
          <div class="title">
            {{ trip.title }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="px-3">
        <v-col>
          <div class="dates">
            {{ formatTripDates(trip.bDate, trip.eDate) }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="px-3">
        <v-col>
          <div class="miles" v-if="trip.distance">
            {{ trip.distance }} miles
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TripInfo",
  props: ["trip"],
  methods: {
    formatTripDates(bDate, eDate) {
      const bDateObj = new Date(bDate);
      const eDateObj = new Date(eDate);

      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const tripDays = (eDateObj - bDateObj) / millisecondsPerDay + 1;
      const dayWord = tripDays > 1 ? "days" : "day";

      const bMon = bDateObj.toLocaleString("UTC", { month: "short" });
      const eMon = eDateObj.toLocaleString("UTC", { month: "short" });
      const tripMonth = bMon === eMon ? bMon : bMon + "-" + eMon;

      const bYear = bDateObj.toLocaleString("UTC", { year: "numeric" });
      const eYear = eDateObj.toLocaleString("UTC", { year: "numeric" });
      const tripYear = bYear === eYear ? bYear : bYear + "-" + eYear;

      return `${tripDays} ${dayWord} in ${tripMonth} ${tripYear}`;
    },
  },
};
</script>

<style lang="scss">
.trip-info {
  background-color: rgba(1, 1, 1, 0.5);
  color: white;
  .title {
    font-size: 1.8rem;
  }
}
</style>
