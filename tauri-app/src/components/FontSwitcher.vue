<template>
  <div class="field">
    <label for="font">{{ $t("font") }}</label>
    <select name="font" v-model="font" @change="changeFont">
      <option value="" disabled selected>{{ $t("select_font") }}</option>
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
      font: "",
      fonts: ["Inter", "Roboto", "Space Grotesk"],
    };
  },
  mounted() {
    const storedFont = localStorage.getItem("font");
    this.applyFont(this.font);
    if (storedFont) {
      this.font = storedFont;
      this.applyFont(this.font);
    }
  },

  methods: {
    changeFont() {
      localStorage.setItem("font", this.font);
      this.applyFont(this.font);
      emit("font-changed", this.font);
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
