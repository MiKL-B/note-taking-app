<template>
  <div id="toolbar">
    <!-- File -->
    <span class="bt-toolbar" @click="toggleSubMenu('file')">File</span>
    <div
      v-if="isSubMenuVisible.file"
      class="sub-menu"
      :style="{ top: '2rem', left: '0.5rem' }"
    >
      <div @click="onSubMenuClick('new')">New</div>
      <div @click="onSubMenuClick('open')">Open...</div>
      <hr class="separator-x" />
      <div @click="onSubMenuClick('save')">Save</div>
      <div @click="onSubMenuClick('saveas')">Save As...</div>
      <hr class="separator-x" />
      <div @click="onSubMenuClick('export')">Export as PDF</div>
      <div @click="onSubMenuClick('print')">Print...</div>
      <hr class="separator-x" />
      <div @click="onSubMenuClick('exit')">Exit</div>
    </div>
    <!-- Edit -->
    <span class="bt-toolbar" @click="toggleSubMenu('edit')">Edit</span>
    <div
      v-if="isSubMenuVisible.edit"
      class="sub-menu"
      :style="{ top: '2rem', left: '4.2rem' }"
    >
      <div @click="onSubMenuClick('undo')">Undo</div>
      <div @click="onSubMenuClick('redo')">Redo</div>
      <div @click="onSubMenuClick('cut')">Cut</div>
      <div @click="onSubMenuClick('copy')">Copy</div>
      <div @click="onSubMenuClick('paste')">Paste</div>
    </div>

    <!-- View -->
    <span class="bt-toolbar" @click="toggleSubMenu('view')">View</span>
    <div
      v-if="isSubMenuVisible.view"
      class="sub-menu"
      :style="{ top: '2rem', left: '8rem' }"
    >
      <div class="sub-menu-toggle" @click="toggleMenuVisibility">
        <span v-if="isVisibleMenu">
          <i class="fa-solid fa-check"></i>
        </span>
        <span>Menu</span>
      </div>
      <div class="sub-menu-toggle" @click="toggleNoteListVisibility">
        <span v-if="isVisibleNoteList">
          <i class="fa-solid fa-check"></i>
        </span>
        <span>Note list</span>
      </div>
      <div class="sub-menu-toggle" @click="toggleNoteBarVisibility">
        <span v-if="isVisibleNoteBar">
          <i class="fa-solid fa-check"></i>
        </span>
        <span>Notebar</span>
      </div>
    </div>
    <!-- Settings -->
    <span class="bt-toolbar" @click="toggleSubMenu('settings')">Settings</span>
    <div
      v-if="isSubMenuVisible.settings"
      class="sub-menu"
      :style="{ top: '2rem', left: '12.2rem' }"
    >
      <div class="sub-menu-toggle">
        <span>
          <i class="fa-solid fa-check"></i>
        </span>
        <span>Markdown</span>
      </div>
      <div class="sub-menu-toggle">
        <span>
          <i class="fa-solid fa-check"></i>
        </span>
        <span>Theme dark</span>
      </div>
      <div class="sub-menu-toggle">
        <span>
          <i class="fa-solid fa-check"></i>
        </span>
        <span>Langue</span>
      </div>
    </div>
    <!-- About -->
    <span class="bt-toolbar" @click="toggleSubMenu('about')">?</span>
    <div
      v-if="isSubMenuVisible.about"
      class="sub-menu"
      :style="{ top: '2rem', left: '18rem' }"
    >
      <div @click="onSubMenuClick('about')">About...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {
      isSubMenuVisible: {
        file: false,
        edit: false,
        view: false,
        setting: false,
        about: false,
      },
      isVisibleMenu: true,
      isVisibleNoteList: true,
      isVisibleNoteBar: true,
    };
  },
  methods: {
    toggleSubMenu(menu) {
      Object.keys(this.isSubMenuVisible).forEach((key) => {
        if (key !== menu) {
          this.isSubMenuVisible[key] = false;
        }
      });
      this.isSubMenuVisible[menu] = !this.isSubMenuVisible[menu];
    },
    onSubMenuClick(action) {
      this.$emit("action-clicked", action);
      this.resetSubMenus();
    },
    toggleMenuVisibility() {
      this.isVisibleMenu = !this.isVisibleMenu;
      this.$emit("toggle-menu", this.isVisibleMenu);
    },
    toggleNoteListVisibility() {
      this.isVisibleNoteList = !this.isVisibleNoteList;
      this.$emit("toggle-notelist", this.isVisibleNoteList);
    },
    toggleNoteBarVisibility() {
      this.isVisibleNoteBar = !this.isVisibleNoteBar;
      this.$emit("toggle-notebar", this.isVisibleNoteBar);
    },
    resetSubMenus() {
      this.isSubMenuVisible = {
        file: false,
        edit: false,
        view: false,
        setting: false,
        about: false,
      };
    },
  },
  mounted() {
    if (document.querySelector(".bt-toolbar")) {
      document.addEventListener("click", (event) => {
        // Vérifier si l'élément cliqué est '.bt-toolbar' ou s'il se trouve à l'intérieur
        const isToolbarClicked = event.target.closest(".bt-toolbar");

        // Si ce n'est pas '.bt-toolbar', exécutez la fonction resetSubMenus
        if (!isToolbarClicked) {
          this.resetSubMenus();
        }
      });
    }
  },
  beforeDestroy() {
    if (document.querySelector(".bt-toolbar")) {
      document.addEventListener("click", (event) => {
        // Vérifier si l'élément cliqué est '.bt-toolbar' ou s'il se trouve à l'intérieur
        const isToolbarClicked = event.target.closest(".bt-toolbar");

        // Si ce n'est pas '.bt-toolbar', exécutez la fonction resetSubMenus
        if (!isToolbarClicked) {
          this.resetSubMenus();
        }
      });
    }
  },
};
</script>
<style>
#toolbar {
  border-top: var(--border);
  border-bottom: var(--border);
  display: flex;
  padding-left: 0.5rem;
  gap: 1rem;
  position: relative;
}
.bt-toolbar {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem 0;
  border-radius: 5px;
  user-select: none;
}
.bt-toolbar:hover {
  background: #f4f4f5;
  cursor: pointer;
}

.sub-menu {
  background-color: white;
  position: absolute;
  z-index: 1;
  margin-top: 5px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 200px;
}

.sub-menu div {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer;
}

.sub-menu div:hover {
  background-color: #f4f4f5; /* Couleur sur survol */
}
.sub-menu-toggle {
  display: flex;
  gap: 0.5rem;
}
</style>
