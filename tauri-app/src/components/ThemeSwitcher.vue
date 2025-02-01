<template>
  <li class="toolbar-toggle" @click="toggleTheme">
    <span v-if="theme === 'dark'">
      <Moon />
    </span>
    <span v-else>
      <Sun />
    </span>
    <span>{{ $t('theme') }}</span>
  </li>
</template>

<script>
import { Sun, Moon } from "lucide-vue-next";
export default {
  name: "ThemeSwitcher",
  data() {
    return {
      theme: "light",
    };
  },
  components: {
    Sun,
    Moon,
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
    },
    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    },
  },
};
</script>
