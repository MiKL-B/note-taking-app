<template>
  <div class="field">
    <label for="language">{{ $t("language") }}</label>
    <select name="language" v-model="language" @change="updateLanguage">
      <option disabled selected>{{ $t("select_language") }}</option>
      <option value="en">{{ $t("english") }}</option>
      <option value="fr">{{ $t("french") }}</option>
    </select>
    <span class="setting-info">{{ $t("language_description") }}</span>
  </div>
</template>

<script>
import { emit } from "@tauri-apps/api/event";
export default {
  name: "LanguageSwitcher",
  data() {
    return {
      language: "en",
    };
  },
  mounted() {
    let storedLanguage = localStorage.getItem("language");
    if (!storedLanguage) {
      storedLanguage = "en";
    }
    this.language = storedLanguage;
    this.updateLanguage();
  },

  methods: {
    updateLanguage() {
      localStorage.setItem("language", this.language);
      this.$i18n.locale = this.language;
      emit("language-changed", this.language);
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
