<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/Upload">Upload</router-link>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body,
html,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
