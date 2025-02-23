<template>
  <div data-tauri-drag-region id="titlebar" class="titlebar">
    <span>{{ name }}</span>
    <div>
      <span class="titlebar-button" @click="minimize" v-if="minimizable">
        <Minus class="size-16"/>
      </span>
      <span class="titlebar-button" @click="maximize" v-if="maximizable">
        <Square class="size-16"/>
      </span>
      <span class="titlebar-button titlebar-close-button" @click="close">
        <X class="size-16"/>
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

  props: {
    name: {
      type: String,
      default: "Thoth",
    },
    minimizable: {
      type: Boolean,
      default: true,
    },
    maximizable: {
      type: Boolean,
      default: true,
    },
  },
  emits:["close-app"],
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
      this.$emit("close-app")
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
  background: var(--bg-titlebar);
  color: var(--text-color-titlebar);
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
  background: var(--bg-hover-titlebar);
  cursor: pointer;
}

.titlebar-close-button:hover {
  background: var(--red);
}
</style>
