<template>
  <RouterView></RouterView>
</template>
<script>
import { RouterView } from "vue-router";
import { listen } from "@tauri-apps/api/event";
export default {
  name: "App",
  components: {
    RouterView,
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
    const storedTheme = localStorage.getItem("theme");
    this.applyTheme(storedTheme);
    if (storedTheme) {
      listen("theme-changed", (event) => {
        const newTheme = event.payload;
        this.applyTheme(newTheme);
      });
    }
    const storedFont = localStorage.getItem("font");
    this.applyFont(storedFont);
    if (storedFont) {
      listen("font-changed", (event) => {
        const newFont = event.payload;
        this.applyFont(newFont);
      });
    }
  },
  methods: {
    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    },
    applyFont(font) {
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        element.style.fontFamily = font;
      });
    },
  },
};
</script>
