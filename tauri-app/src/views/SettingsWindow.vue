<template>
  <Titlebar :name="$t('settings')" :maximizable="false"/>
  <div id="settings">
    <LanguageSwitcher />
    <!-- <ThemeSwitcher /> -->
  </div>
</template>

<script>
import Titlebar from "../components/Titlebar.vue";
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
// import ThemeSwitcher from "../components/ThemeSwitcher.vue";
export default {
  name: "SettingsWindow",
  components: {
    Titlebar,
    LanguageSwitcher,
    // ThemeSwitcher,
  },
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
