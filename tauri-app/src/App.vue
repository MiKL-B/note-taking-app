<template>
  <Titlebar />
  <RouterView></RouterView>
</template>
<script>
import { RouterView } from "vue-router";
import Titlebar from "./components/Titlebar.vue";
import { listen } from "@tauri-apps/api/event";
export default {
  name: "App",
  components: {
    RouterView,
    Titlebar,
  },

  mounted() {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      this.$i18n.locale = storedLanguage;
      listen("language-changed", (event) => {
        const newLanguage = event.payload;
        this.$i18n.locale = newLanguage;
      });
    }
  },
};
</script>
<style></style>
