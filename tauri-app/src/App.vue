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
  data() {
    return {
      language: "en",
      theme: "light",
      font: "Inter",
      fontSize: 16,
    };
  },

  mounted() {
    // language
    let storedLanguage = localStorage.getItem("language");
    if (!storedLanguage) {
      storedLanguage = "en";
    }
    this.language = storedLanguage;
    this.updateLanguage(this.language);

    // theme
    let storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      storedTheme = "light";
    }
    this.theme = storedTheme;
    this.updateTheme(this.theme);

    // font
    let storedFont = localStorage.getItem("font");
    if (!storedFont) {
      storedFont = "Inter";
    }
    this.font = storedFont;
    this.updateFont(this.font);

    // font size
    let storedFontSize = localStorage.getItem("font-size");
    if (!storedFontSize) {
      storedFontSize = 16;
    }
    this.fontSize = storedFontSize;
    this.updateFontSize(this.fontSize);
  },
  methods: {
    // language
    updateLanguage(newLanguage) {
      localStorage.setItem("language", newLanguage);
      listen("language-changed", (event) => {
        newLanguage = event.payload;
        this.$i18n.locale = newLanguage;
      });
      this.$i18n.locale = newLanguage;
    },
    // theme
    updateTheme(newTheme) {
      localStorage.setItem("theme", newTheme);
      listen("theme-changed", (event) => {
        document.documentElement.setAttribute("data-theme", event.payload);
      });
      document.documentElement.setAttribute("data-theme", newTheme);
    },
    // font
    updateFont(newFont) {
      localStorage.setItem("font", newFont);
      listen("font-changed", (event) => {
        const elements = document.querySelectorAll("*");
        elements.forEach((element) => {
          element.style.fontFamily = event.payload;
        });
      });
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        element.style.fontFamily = newFont;
      });
    },
    // font size
    updateFontSize(newSize) {
      localStorage.setItem("font-size", newSize);
      listen("font-size-changed", (event) => {
        const elements = document.querySelectorAll("textarea");
        elements.forEach((element) => {
          element.style.fontSize = event.payload + "px";
        });
      });

      const elements = document.querySelectorAll("textarea");
      elements.forEach((element) => {
        element.style.fontSize = newSize + "px";
      });
    },
  },
};
</script>
