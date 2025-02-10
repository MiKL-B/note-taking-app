<template>
  <Titlebar :name="$t('settings')" :maximizable="false"/>
  <div id="settings">
    <LanguageSwitcher />
    <ThemeSwitcher />
        <!-- <select name="" id="">
      <option value="" disabled selected>{{$t('font')}}</option>
      <option value="">Arial</option>
      <option value="">Time New Roman</option>
      <option value="">Roboto</option>
      <option value="">Ubuntu</option>
    </select>
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
export default {
  name: "SettingsWindow",
  components: {
    Titlebar,
    LanguageSwitcher,
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
