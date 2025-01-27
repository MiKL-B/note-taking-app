<template>
  <div id="statusbar">Status</div>
</template>

<script>
export default {
  name: "Statusbar",
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
  color: var(--dark);
  display: flex;
  user-select: none;
  align-items: center;
  border-top:var(--border);
}
</style>
