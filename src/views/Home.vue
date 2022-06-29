<template>
  <div class="main">
    <div class="content">
      <div class="content-row">
        <section class="trips">Trips</section>
        <section class="map">Maps</section>
        <section class="parks">Parks</section>
      </div>
      <div class="timeline-row">
        <div class="timeline">Timeline</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    return {
      setUser: (user) => store.commit("setUser", user),
      setToken: (token) => store.commit("setToken", token),
    };
  },
  data() {
    return {
      name: "Home",
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  height: 100%;
  grid-template-rows: minmax(400px, 800px);
}
.content {
  background-color: #f5f5f5;
  display: grid;
  grid-template-rows: auto 100px;

  .content-row {
    display: grid;
    grid-template-columns:
      minmax(20%, 300px)
      minmax(60%, 1400px)
      minmax(20%, 300px);
    .trips {
      background-color: #eba1a1;
    }
    .map {
      background-color: #dad6b6;
    }
    .parks {
      background-color: #a1cceb;
    }
  }
  .timeline-row {
    display: grid;
    .timeline {
      background-color: #c2e5c4;
    }
  }
}
</style>
