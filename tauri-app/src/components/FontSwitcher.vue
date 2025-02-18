<template>
  <div class="field">
    <label for="font">{{ $t("font") }}</label>
    <select name="font" v-model="font" @change="updateFont">
      <option disabled selected>{{ $t("select_font") }}</option>
      <option v-for="font in fonts" :value="font">{{ font }}</option>
    </select>
    <span class="setting-info">{{ $t("font_description") }}</span>
  </div>
  <div class="field">
    <label for="font-size">{{ $t("font_size") }}</label>
    <select name="font-size" v-model="fontSize" @change="updateFontSize">
      <option disabled selected>{{ $t("select_font_size") }}</option>
      <option v-for="size in fontsSize" :value="size">{{ size }}</option>
    </select>
    <span class="setting-info">{{ $t("font_size_description") }}</span>
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
      fontSize: 16,
      fontsSize: [12, 14, 16, 18, 20, 22, 24, 26],
    };
  },
  mounted() {
    let storedFont = localStorage.getItem("font");
    if (!storedFont) {
      storedFont = "Inter";
    }
    this.font = storedFont;
    this.updateFont();

    let storedFontSize = localStorage.getItem("font-size");
    if (!storedFontSize) {
      storedFontSize = 16;
    }
    this.fontSize = storedFontSize;
    this.updateFontSize();
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
    updateFontSize() {
      localStorage.setItem("font-size", this.fontSize);
      const elements = document.querySelectorAll("textarea");
      elements.forEach((element) => {
        element.style.fontSize = this.fontSize + "px";
      });
      emit("font-size-changed", this.fontSize);
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
