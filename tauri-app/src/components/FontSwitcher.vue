<template>
  <div class="field">
    <label for="font">{{ $t("font") }}</label>
    <select name="font" v-model="font" @change="updateFont">
      <option disabled selected>{{ $t("select_font") }}</option>
      <option v-for="font in fonts" :value="font">{{ font }}</option>
    </select>
    <span class="setting-info">{{ $t("font_description") }}</span>
  </div>
</template>

<script>
import { emit } from "@tauri-apps/api/event";
export default {
  name: "FontSwitcher",
  data() {
    return {
      font: "Inter",
      fonts: ["Inter", "Roboto", "Space Grotesk"],
    };
  },
  mounted() {
    let storedFont = localStorage.getItem("font");
    if (!storedFont) {
      storedFont = "Inter";
    }
    this.font = storedFont;
    this.updateFont()
  },

  methods: {
    updateFont() {
      localStorage.setItem("font", this.font);
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        element.style.fontFamily = this.font;
      });
      emit("font-changed", this.font);
    },
  },
};
</script>

<style>
.field {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color-label);
}
.setting-info {
  margin: 0.5rem 0;
  font-size: 14px;
  color: var(--dark);
}
</style>
