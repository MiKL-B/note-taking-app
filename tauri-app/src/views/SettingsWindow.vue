<template>
  <Titlebar :name="$t('settings')" :minimizable="false" :maximizable="false"/>
  <div id="settings">
    <LanguageSwitcher />
    <FontSwitcher/>
    <ThemeSwitcher />
    <hr class="separator-x">
    <button class="danger" @click="resetSettings">{{$t('reset_settings')}}</button>
  </div>
</template>

<script>
import Titlebar from "../components/Titlebar.vue";
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
import ThemeSwitcher from "../components/ThemeSwitcher.vue";
import FontSwitcher from "../components/FontSwitcher.vue";
export default {
  name: "SettingsWindow",
  components: {
    Titlebar,
    LanguageSwitcher,
    FontSwitcher,
    ThemeSwitcher,
  },
  methods:{
    resetSettings(){
      localStorage.removeItem("theme")
      localStorage.removeItem("font")
      localStorage.removeItem("language")
      localStorage.removeItem("font-size")
      window.location.reload()
    }
  }
};
</script>
<style>
#settings {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
