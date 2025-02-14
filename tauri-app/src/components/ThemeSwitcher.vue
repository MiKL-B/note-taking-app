<template>
  <div class="field">
    <label for="theme">{{ $t("theme") }}</label>
    <div class="flex align-center gap-4">
      <input type="checkbox" @click="toggleTheme" :checked="theme === 'dark'"/>
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
      theme: "light",
    };
  },

  mounted() {
    let storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      storedTheme = "light";
    } 
    this.theme = storedTheme;
    this.updateTheme(this.theme);
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      this.updateTheme(this.theme)
    },
    updateTheme(newTheme) {
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      emit("theme-changed", newTheme);
    },
  },
};
</script>

<style>
.label{
  color:var(--text-color-label);
}
</style>
