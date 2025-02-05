<template>
  

    <LanguageSwitcher />
    <ThemeSwitcher />

</template>

<script>
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
import ThemeSwitcher from "../components/ThemeSwitcher.vue";
export default {
  name: "NewWindow",
  components: {
    LanguageSwitcher,
    ThemeSwitcher
  },
};
</script>
