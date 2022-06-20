<template>
  <div class="main">
    <header class="header">
      <div></div>
      <div class="header-content">Header</div>
      <div></div>
    </header>
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
    <div class="upload-link">
      <a href="#/upload">upload</a>
    </div>
  </div>
  <!-- <div class="row">
    <input v-model.number="num1" type="number" />
    <span>+</span>
    <input v-model.number="num2" type="number" />
    <span>=</span>
    <span>{{ num1 + num2 }}</span>
  </div>
  <div class="row second">
    <select v-model="name">
      <option>Carne Asada</option>
      <option>Pollo</option>
      <option>Bean</option>
      <option>Al Pastor</option>
    </select>
    <p v-if="name">My favorite kind of taco is {{ name }}</p>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      name: "Vue",
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  height: 100%;
  grid-template-rows: 100px minmax(400px, 800px);
}
.header {
  display: grid;
  grid-template-columns: auto minmax(50%, 1140px) auto;
  width: 100%;
  .header-content {
    background-color: #e9baf1;
  }
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
