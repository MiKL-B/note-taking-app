<template>
  <div data-tauri-drag-region id="titlebar">
    <span>Thoth</span>
    <div>
      <span class="titlebar_button" @click="minimize">
        <AppIcon iconName="Minus" class="size-16"/>
      </span>
      <span class="titlebar_button" @click="maximize">
        <AppIcon iconName="Square" class="size-16"/>
      </span>
      <span class="titlebar_button titlebar_button--close" @click="close">
        <AppIcon iconName="X" class="size-16"/>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentWindow } from "@tauri-apps/api/window";
import AppIcon from "./AppIcon.vue";
const appWindow = getCurrentWindow();
const emit = defineEmits(['close-app'])
const minimize = () => appWindow.minimize();
const maximize = () => appWindow.toggleMaximize();
const close = () => emit("close-app");
</script>

<style>
#titlebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  padding-left: 0.5rem;
  background: var(--bg-titlebar);
  color: var(--text-color-titlebar);
  border-bottom: var(--border);
}

.titlebar_button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 33px;
}

.titlebar_button:hover {
  background: var(--bg-hover-titlebar);
  cursor: pointer;
}

.titlebar_button--close:hover {
  background: var(--red);
}
</style>
