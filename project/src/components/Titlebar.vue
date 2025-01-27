<template>
  <div id="titlebar">
    <span>App notes</span>
    <span class="note-name">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "Titlebar",
  props:['name']
};
</script>

<style>
#titlebar {
  height: 30px;
  padding-left: 1rem;
  background: var(--lightgrey);
  color: var(--dark);
  display: flex;
  user-select: none;
  align-items: center;
  app-region: drag;
  width:calc(100% - 130px);
}

.note-name{
  flex-grow: 1;
  text-align: center;
}
</style>
