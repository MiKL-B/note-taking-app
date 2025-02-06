<template>
  <div id="toolbar">
    <!-- file -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">{{ $t("file") }}</summary>
      <ul class="toolbar-menu">
        <li @click="onSubMenuClick('new')">{{ $t("new") }}</li>
        <li @click="onSubMenuClick('open')">{{ $t("open") }}</li>
        <li @click="onSubMenuClick('save')">{{ $t("save") }}</li>
        <hr class="separator-x" />
        <li @click="onSubMenuClick('exportJSON')">{{ $t("exportjson") }}</li>
        <li @click="onSubMenuClick('importJSON')">{{ $t("importjson") }}</li>
        <!-- <li @click="onSubMenuClick('export')">{{ $t("exportaspdf") }}</li>
        <li>{{ $t("print") }}</li> -->
        <hr class="separator-x" />
        <li @click="close">{{ $t("exit") }}</li>
      </ul>
    </details>
    <!-- Edit -->
    <!-- <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">{{ $t("edit") }}</summary>
      <ul class="toolbar-menu">
        <li>{{ $t("undo") }}</li>
        <li>{{ $t("redo") }}</li>
        <li>{{ $t("cut") }}</li>
        <li>{{ $t("copy") }}</li>
        <li>{{ $t("paste") }}</li>
      </ul>
    </details> -->

    <!-- Settings -->
    <span class="toolbar-btn" @click="openWindow">{{ $t("settings") }}</span>

    <!-- About -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">?</summary>
      <ul class="toolbar-menu">
        <li @click="displayAbout">{{ $t("about") }}</li>
      </ul>
    </details>
  </div>
</template>

<script>

import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const appWindow = getCurrentWindow();
export default {
  name: "Toolbar",
  mounted() {
    document.addEventListener("click", this.closeDetails);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeDetails);
  },
  methods: {
    openWindow() {
      const webview = new WebviewWindow("settings_window", {
        url: "./settings-window",
        decorations: false,
        title: "Settings",
        resizable: false,
        alwaysOnTop: true,
        center: true,
        width: 600,
        height: 400,
      });
      webview.once("tauri://created", function () {
        document.body.style.pointerEvents = "none";
        document.body.style.userSelect = "none";
        document.body.style.opacity = "0.5";
      });

      webview.once("tauri://close-requested", function () {
        webview.close();
      });
      webview.once("tauri://destroyed", function () {
        document.body.style.pointerEvents = "auto";
        document.body.style.userSelect = "auto";
        document.body.style.opacity = "1";
      });

      webview.once("tauri://error", function (e) {
        console.error("Erreur lors de la création du webview :", e);
      });
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
    displayAbout() {
      let msg = this.$t("developed");
      alert(msg + " Becquer Michaël.");
    },
    close() {
      appWindow.close();
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
  color:var(--text-color-toolbar);
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

.toolbar-menu {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  margin-top: 5px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 100px;
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
