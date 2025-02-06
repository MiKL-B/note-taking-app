<template>
  <div class="field">
    <label for="language">{{ $t("language") }}</label>
    <select name="language" v-model="language" @change="changeLanguage">
      <option value="" disabled selected>{{ $t("select_language") }}</option>
      <option value="en">{{ $t("english") }}</option>
      <option value="fr">{{ $t("french") }}</option>
    </select>
    <span class="setting-info">{{ $t("language_description") }}</span>
  </div>
</template>

<script>
import { Languages } from "lucide-vue-next";
import { emit } from "@tauri-apps/api/event";
export default {
  name: "LanguageSwitcher",
  components: {
    Languages,
  },
  data() {
    return {
      language: "",
    };
  },
  mounted() {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      this.language = storedLanguage;
    }
    this.$i18n.locale = this.language;
  },

  methods: {
    changeLanguage() {
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
}
.setting-info {
  margin: 0.5rem 0;
  font-size: 14px;
  color: var(--dark);
}
</style>
