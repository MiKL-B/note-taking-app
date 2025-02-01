<template>
  <div id="statusbar">
    <span v-if="noteLength !== ''"
      >{{ $t("characters") }}: {{ noteLength }}</span
    >
  </div>
</template>

<script>
export default {
  name: "Statusbar",
  props: ["noteLength"],
};
</script>
<style>
#statusbar {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 30px;
  padding-left: 0.5rem;
  background: var(--lightgrey);
  color: var(--dark2);
  display: flex;
  gap: 1rem;
  user-select: none;
  align-items: center;
  border-top: var(--border);
}
</style>
