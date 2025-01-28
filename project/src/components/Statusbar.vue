<template>
  <div id="statusbar">
    <span>Status</span>
    <span class="separator-y"></span>
    <span v-if="noteLength !== ''">{{ noteLength }} caractères</span>
  </div>
</template>

<script>
import Notelist from './Notelist.vue';

export default {
  name: "Statusbar",
  props:["noteLength"]
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
  gap:1rem;
  user-select: none;
  align-items: center;
  border-top:var(--border);
}
</style>
