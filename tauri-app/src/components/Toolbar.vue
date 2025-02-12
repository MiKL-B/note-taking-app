<template>
  <div id="toolbar">
    <details
      class="toolbar-details"
      v-for="menu in menus"
      @click="handleClickOnDetails"
    >
      <summary class="toolbar-btn">{{ $t(menu.name) }}</summary>
      <ul class="toolbar-menu">
        <li v-for="item in menu.items" @click="onSubMenuClick(item.label)">
          {{ $t(item.label) }}
        </li>
      </ul>
    </details>
    <!-- view -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">{{ $t("view") }}</summary>
      <ul class="toolbar-menu">
        <li @click="toggleSidebar" class="flex align-center gap-4">
          <Check v-if="isVisibleSidebar" class="size-16 text-dark" />
          {{ $t("sidebar") }}
        </li>
        <li @click="toggleNoteList" class="flex align-center gap-4">
          <Check v-if="isVisibleNotelist" class="size-16 text-dark" />
          {{ $t("notelist") }}
        </li>
      </ul>
    </details>
    <span class="toolbar-btn" @click="openWindow">{{ $t("settings") }}</span>
    <span class="toolbar-btn" @click="displayAbout">{{ $t("about") }}</span>
  </div>
</template>

<script>
import { Check } from "lucide-vue-next";
export default {
  name: "Toolbar",
  components: {
    Check,
  },
  emits: [
    "action-clicked",
    "display-about",
    "open-window",
    "toggle-sidebar",
    "toggle-notelist",
  ],
  mounted() {
    document.addEventListener("click", this.closeDetails);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeDetails);
  },
  data() {
    return {
      isVisibleSidebar: true,
      isVisibleNotelist: true,
      menus: [
        {
          name: "file",
          items: [
            { label: "new" },
            { label: "open" },
            { label: "save" },
            { label: "exportjson" },
            { label: "importjson" },
            { label: "exit" },
          ],
        },
      ],
    };
  },
  methods: {
    openWindow() {
      this.$emit("open-window");
    },
    handleClickOnDetails() {
      let detailsOpened = document.querySelectorAll(".toolbar-details");
      for (const item of detailsOpened) {
        if (this != item) {
          item.removeAttribute("open");
        }
      }
    },
    closeDetails(event) {
      if (!event.target.closest("details")) {
        let detailsOpened = document.querySelectorAll(".toolbar-details");
        detailsOpened.forEach((item) => {
          item.removeAttribute("open");
        });
      }
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
.toolbar-btn:hover,
.toolbar-menu li:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}
li hr:hover {
  background: none;
}
.toolbar-menu {
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
}
.toolbar-toggle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
summary {
  list-style-type: none;
}
</style>
