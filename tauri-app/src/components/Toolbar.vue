<template>
  <div id="toolbar">
    <ToolbarFile @action-clicked="onSubMenuClick" />
    <ToolbarView @select-view="selectView" :distractionFree="distractionFree"/>
    <ToolbarSettings />
    <ToolbarAbout @action-clicked="onSubMenuClick" />
  </div>
</template>

<script>
import ToolbarFile from "./ToolbarFile.vue";
import ToolbarView from "./ToolbarView.vue";
import ToolbarSettings from "./ToolbarSettings.vue";
import ToolbarAbout from "./ToolbarAbout.vue";
export default {
  name: "Toolbar",
  components: {
    ToolbarFile,
    ToolbarView,
    ToolbarSettings,
    ToolbarAbout,
  },
  props:["distractionFree"],
  emits: ["action-clicked","select-view"],
  methods: {
    onSubMenuClick(action) {
      this.$emit("action-clicked", action);
    },
    selectView(newView){
      this.$emit("select-view",newView)
    }
  },
};
</script>

<style>
#toolbar {
  border-bottom: var(--border);
  display: flex;
  padding-left: 1px;
  gap: 1rem;
  position: relative;
  background: var(--bg-toolbar);
  color: var(--text-color-toolbar);
  height: 33px;
}
.toolbar-btn {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem 0;
  border-radius: 5px;
  user-select: none;
}
.toolbar-btn:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}
</style>
