<template>
  <li class="toolbar-toggle" @click="toggleLanguage">
    <Languages />
    <span>{{ $t('language') }}</span>
  </li>
</template>

<script>
import { Languages } from 'lucide-vue-next';
export default {
  name: "LanguageSwitcher",
  data() {
    return {
      language: "en",
    };
  },
  components:{
    Languages
  },
  mounted() {
    const storedLanguage = localStorage.getItem("language")
    if (storedLanguage){
      this.language = storedLanguage;
      this.$i18n.locale = this.language;
    }
  },
  methods: {
    toggleLanguage() {
      this.language = this.language === "en" ? "fr" : "en";
      this.$i18n.locale = this.language;
      localStorage.setItem("language", this.$i18n.locale);
    },
  },
};
</script>
