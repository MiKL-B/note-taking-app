<template>
  <Titlebar />
  <RouterView></RouterView>
  
</template>
<script>
import { RouterView } from "vue-router";
import Titlebar from "./components/Titlebar.vue";

export default {
  name: "App",
  components:{
    Titlebar
  }
};
</script>
<style>

</style>
