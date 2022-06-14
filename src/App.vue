<template>
  <div class="row">
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
  </div>
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
$primary: #5968d7;

.row {
  margin: 50px;
  display: flex;
  justify-content: center;
  font-family: "Work Sans", sans-serif;
}

input,
span {
  padding: 10px;
  font-size: 30px;
  font-family: "Work Sans", sans-serif;
}

input {
  width: 50px;
}

span {
  width: 20px;
}

.second {
  font-size: 18px;
  p {
    margin-left: 20px;
  }
}
</style>
