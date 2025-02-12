<template>
  <Titlebar :name="$t('settings')" :minimizable="false" :maximizable="false"/>
  <div id="settings">
    <LanguageSwitcher />
    <FontSwitcher/>
    <ThemeSwitcher />

        <!-- 
    <select name="" id="">
      <option value="" disabled selected>{{$t('font_size')}}</option>
      <option value="">12</option>
      <option value="">14</option>
      <option value="">16</option>
      <option value="">18</option>
    </select> -->
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
