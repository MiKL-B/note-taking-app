<template>
  <div id="toolbar">
    <!-- file -->
    <DetailsCompo :title="$t('file')" btn="toolbar-btn">
      <template v-slot:header>{{ $t("file") }}</template>
      <template v-slot:content>
        <li v-for="item in items" @click="onSubMenuClick(item.label)">
          {{ $t(item.label) }}
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
      items: [
        { label: "new" },
        { label: "open" },
        { label: "save" },
        { label: "exportjson" },
        { label: "importjson" },
        { label: "exit" },
      ],
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

li hr:hover {
  background: none;
}
/* .toolbar-menu {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 100px;
  user-select: none;
}
.toolbar-menu li {
  list-style-type: none;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer;
} */
.toolbar-toggle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
summary {
  list-style-type: none;
}
</style>
