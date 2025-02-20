<template>
  <DetailsCompo :title="$t('settings')" btn="toolbar-btn">
    <template v-slot:content>
      <!-- language -->
      <span>{{$t('language')}}</span>
      <li @click="selectLanguage(language)" v-for="language in languages" class="flex align-center gap-4">
       <Check v-if="language === currentLanguage" class="size-16 text-dark"/>
       {{$t(language)}}
      </li>
      <hr class="separator-x">
      <!-- font -->
      <span>{{$t('font')}}</span>
      <li @click="selectFont(font)" v-for="font in fonts" class="flex align-center gap-4">
        <Check v-if="font === currentFont" class="size-16 text-dark"/>
        {{font}}
      </li>
      <hr class="separator-x">
      <!-- font size -->
      <span>{{$t('font_size')}}</span>
      <li @click="selectFontSize(fontSize)" v-for="fontSize in fontsSize" class="flex align-center gap-4">
        <Check v-if="fontSize.toString() === currentFontSize.toString()" class="size-16 text-dark"/>
        {{fontSize}}
      </li>
      <hr class="separator-x">
      <!-- theme -->
      <span>{{$t('theme')}}</span>
        <li @click="selectTheme(theme)" v-for="theme in themes" class="flex align-center gap-4">
       <Check v-if="theme === currentTheme" class="size-16 text-dark"/>
       {{$t(theme)}}
       </li>
       <hr class="separator-x">
       <!-- reset -->

       <li @click="resetSettings" class="text-red">{{$t('reset_settings')}}</li>
      </template>
    </DetailsCompo>
</template>

<script>
import { Check } from "lucide-vue-next";
import DetailsCompo from "./DetailsCompo.vue";
export default {
  name: "Settings",
  components:{
    Check,DetailsCompo
  },
  data() {
    return {
      // language
      currentLanguage: localStorage.getItem("language") || "en",
      languages:["en","fr"],
      // font
      currentFont: localStorage.getItem("font") || "Inter",
      fonts:["Inter","Roboto","Space Grotesk"],
      // font size
      currentFontSize:localStorage.getItem("font-size") || 16,
      fontsSize:[16, 18, 20, 22, 24, 26],
      // theme
      currentTheme:localStorage.getItem("theme") || "light",
      themes:["light","dark"],
    };
  },
  mounted() {
    this.selectLanguage(this.currentLanguage);
    this.selectFont(this.currentFont);
    this.selectFontSize(this.currentFontSize);
    this.selectTheme(this.currentTheme);
  },

  methods: {
    selectLanguage(newLanguage){
      this.currentLanguage = newLanguage;
      localStorage.setItem("language",this.currentLanguage);
      this.$i18n.locale = this.currentLanguage;
    },
    selectFont(newFont){
      this.currentFont = newFont;
      localStorage.setItem("font",this.currentFont)
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        element.style.fontFamily = this.currentFont;
      });
    },
    selectFontSize(newFontSize){
      this.currentFontSize = newFontSize 
      localStorage.setItem("font-size",this.currentFontSize);
      const elements = document.querySelectorAll("textarea");
      elements.forEach((element) => {
        element.style.fontSize = this.currentFontSize + "px";
      });
    },
    selectTheme(newTheme){
      this.currentTheme = newTheme;
      localStorage.setItem("theme",this.currentTheme);
      document.documentElement.setAttribute("data-theme", this.currentTheme);
    },
    resetSettings(){
      this.selectLanguage("en");
      this.selectFont("Inter");
      this.selectFontSize(16);
      this.selectTheme("light");
    }
  },
};
</script>
