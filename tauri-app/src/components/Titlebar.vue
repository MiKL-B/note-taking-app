<template>
  <div data-tauri-drag-region id="titlebar">
    <span>{{ $t('appnotes') }}</span>
    <div>
      <span class="titlebar-button" @click="minimize">
        <Minus />
      </span>
      <span class="titlebar-button" @click="maximize">
        <Square />
      </span>
      <span class="titlebar-button titlebar-close-button" @click="close">
        <X />
      </span>
    </div>
  </div>
</template>

<script>
import { getCurrentWindow } from "@tauri-apps/api/window";
const appWindow = getCurrentWindow();
import { Minus, Square, X } from "lucide-vue-next";
export default {
  name: "Titlebar",
  components: {
    Minus,
    Square,
    X,
  },
  methods: {
    minimize() {
      appWindow.minimize();
    },
    maximize() {
      appWindow.toggleMaximize();
    },
    close() {
      appWindow.close();
    },
  },
};
</script>

<style>
#titlebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  padding-left: 0.5rem;
  background: var(--lightgrey);
  color: var(--text-color);
  border-bottom: var(--border);
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
.titlebar-button:hover {
  background: var(--grey);
  cursor: pointer;
}

.titlebar-close-button:hover {
  background: var(--red);
}

</style>
