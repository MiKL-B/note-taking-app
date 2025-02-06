<template>
  <div id="settings">
    <LanguageSwitcher />
    <!-- <ThemeSwitcher /> -->
  </div>
</template>

<script>
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
// import ThemeSwitcher from "../components/ThemeSwitcher.vue";
export default {
  name: "NewWindow",
  components: {
    LanguageSwitcher,
    // ThemeSwitcher,
  },
};
</script>
<style>
#settings{
  padding:1rem;
  display: flex;
  flex-direction: column;
  gap:1rem;
}
</style>