<template>
  <div v-for="trip in tripList" class="trip">
    <div class="title">{{ trip.title }}</div>
    <div class="dates">
      {{ trip.bDate.substr(0, 10) }} - {{ trip.eDate.substr(0, 10) }}
    </div>
    <div class="parks">
      <div v-for="park in trip.parks">
        <img src="../assets/logos/{{park.toLowerCase()}}.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Trips",
  props: ["tripList"],
};
</script>

<style lang="scss" scoped>
.trip {
  background-color: antiquewhite;
  border: 1px solid;
  display: grid;
}
.parks {
  display: flex;
  flex-direction: row;
  div {
  }
}
</style>
