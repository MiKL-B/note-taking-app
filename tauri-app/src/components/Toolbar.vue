<template>
  <div id="toolbar">
    <!-- file -->
    <DetailsCompo :title="$t('file')" btn="toolbar-btn">
      <template v-slot:header>{{ $t("file") }}</template>
      <template v-slot:content>
        <li @click="onSubMenuClick('new')">
          {{ $t("new") }}
        </li>
        <li @click="onSubMenuClick('open')">
          {{ $t("open") }}
        </li>
        <li @click="onSubMenuClick('save')">
          {{ $t("save") }}
        </li>
        <hr class="separator-x" />
        <li @click="onSubMenuClick('exportjson')">
          {{ $t("exportjson") }}
        </li>
        <li @click="onSubMenuClick('importjson')">
          {{ $t("importjson") }}
        </li>
        <hr class="separator-x" />
        <li @click="onSubMenuClick('exit')">
          {{ $t("exit") }}
        </li>
      </template>
    </DetailsCompo>
    <!-- view -->
    <DetailsCompo :title="$t('view')" btn="toolbar-btn">
      <template v-slot:header>{{ $t("view") }}</template>
      <template v-slot:content>
        <li @click="toggleSidebar" class="flex align-center gap-4">
          <Check v-if="isVisibleSidebar" class="size-16 text-dark" />
          {{ $t("sidebar") }}
        </li>
        <li @click="toggleNoteList" class="flex align-center gap-4">
          <Check v-if="isVisibleNotelist" class="size-16 text-dark" />
          {{ $t("notelist") }}
        </li>
        <!-- <hr class="separator-x" />
        <li>Kanban</li>
        <li>Schedule</li>
        <li>Drawing</li> -->
      </template>
    </DetailsCompo>
    <span class="toolbar-btn" @click="openWindow">{{ $t("settings") }}</span>
    <span class="toolbar-btn" @click="displayAbout">{{ $t("about") }}</span>
  </div>
</template>

<script>
import { Check } from "lucide-vue-next";
import DetailsCompo from "./DetailsCompo.vue";
export default {
  name: "Toolbar",
  components: {
    Check,
    DetailsCompo,
  },
  emits: [
    "action-clicked",
    "display-about",
    "open-window",
    "toggle-sidebar",
    "toggle-notelist",
  ],
  data() {
    return {
      isVisibleSidebar: true,
      isVisibleNotelist: true,
    };
  },
  methods: {
    openWindow() {
      this.$emit("open-window");
    },
    onSubMenuClick(action) {
      this.$emit("action-clicked", action);
    },
    toggleSidebar() {
      this.isVisibleSidebar = !this.isVisibleSidebar;
      this.$emit("toggle-sidebar");
    },
    toggleNoteList() {
      this.isVisibleNotelist = !this.isVisibleNotelist;
      this.$emit("toggle-notelist");
    },
    displayAbout() {
      this.$emit("display-about");
    },
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
