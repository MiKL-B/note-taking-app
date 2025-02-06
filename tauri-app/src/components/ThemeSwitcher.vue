<template>
  <div class="field">
    <label for="theme">{{ $t("theme") }}</label>
    <div class="flex align-center gap-4">
      <input type="checkbox" @click="toggleTheme" :checked="theme === 'dark' ? true : false"/>
      <span class="label">{{ theme === "light" ? $t("light") : $t("dark") }}</span>
    </div>
  </div>
</template>

<script>
import { emit } from "@tauri-apps/api/event";
export default {
  name: "ThemeSwitcher",
  data() {
    return {
      theme: "",
    };
  },

  mounted() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      this.theme = storedTheme;
      this.applyTheme(this.theme);
    } else {
      this.applyTheme(this.theme);
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      this.applyTheme(this.theme);
      localStorage.setItem("theme", this.theme);
      emit("theme-changed", this.theme);
    },
    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    },
  },
};
</script>

<style>
.label{
  color:var(--text-color-label);
}
</style>
