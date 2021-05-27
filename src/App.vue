<template>
  <Navbar />
  <router-view :key="$route.fullPath"/>
</template>

<script>
import Navbar from "@/components/other/Navbar.vue";

import "@/../public/styles.css";

export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
}
body {
  margin: 0px;
  padding: 0px;
}
</style>