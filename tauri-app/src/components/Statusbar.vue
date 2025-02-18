<template>
  <div id="statusbar">
    <span v-if="characterCount !== ''"
      >{{ $t("characters") }}: {{ characterCount }}</span
    >
    <span>{{ $t("words") }}: {{ wordCount }}</span>
  </div>
</template>

<script>
export default {
  name: "Statusbar",
  props: ["characterCount","wordCount"],
};
</script>
<style>
#statusbar {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 30px;
  padding-left: 0.5rem;
  color: var(--text-color-statusbar);
  display: flex;
  gap: 1rem;
  user-select: none;
  align-items: center;
  border-top: var(--border);
}
</style>
