<template>
  <div id="toolbar">
    <!-- File -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">File</summary>
      <ul class="toolbar-menu">
        <li @click="onSubMenuClick('new')">New</li>
        <li>Open</li>
        <hr class="separator-x" />
        <li>Save</li>
        <li>Save as...</li>
        <hr class="separator-x" />
        <li>Export as PDF</li>
        <li>Print...</li>
        <hr class="separator-x" />
        <li>Exit</li>
      </ul>
    </details>
    <!-- Edit -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">Edit</summary>
      <ul class="toolbar-menu">
        <li>Undo</li>
        <li>Redo</li>
        <li>Cut</li>
        <li>Copy</li>
        <li>Paste</li>
      </ul>
    </details>
    <!-- View -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">View</summary>
      <ul class="toolbar-menu">
        <li class="toolbar-toggle" @click="toggleMenuVisibility">
          <span v-if="isVisibleMenu">
            <i class="fa-solid fa-check"></i>
          </span>
          <span>Menu</span>
        </li>
        <li class="toolbar-toggle" @click="toggleNoteListVisibility">
          <span v-if="isVisibleNoteList">
            <i class="fa-solid fa-check"></i>
          </span>
          <span>Note list</span>
        </li>
        <li class="toolbar-toggle" @click="toggleNoteBarVisibility">
          <span v-if="isVisibleNoteBar">
            <i class="fa-solid fa-check"></i>
          </span>
          <span>Notebar</span>
        </li>
      </ul>
    </details>
    <!-- Settings -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">Settings</summary>
      <ul class="toolbar-menu">
        <li class="toolbar-toggle">
          <span>
            <i class="fa-solid fa-check"></i>
          </span>
          <span>Markdown</span>
        </li>
        <li class="toolbar-toggle">
          <span>
            <i class="fa-solid fa-check"></i>
          </span>
          <span>Theme dark</span>
        </li>
        <li class="toolbar-toggle">
          <span>
            <i class="fa-solid fa-check"></i>
          </span>
          <span>Langue</span>
        </li>
      </ul>
    </details>
    <!-- About -->
    <details class="toolbar-details" @click="handleClickOnDetails">
      <summary class="toolbar-btn">?</summary>
      <ul class="toolbar-menu">
        <li>About...</li>
      </ul>
    </details>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {
      isVisibleMenu: true,
      isVisibleNoteList: true,
      isVisibleNoteBar: true,
    };
  },
  methods: {
    onSubMenuClick(action) {
      this.$emit("action-clicked", action);
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

    handleClickOnDetails() {
      let detailsOpened = document.querySelectorAll(".toolbar-details");
      for (const item of detailsOpened) {
        if (this != item) {
          item.removeAttribute("open");
        }
      }
    },
    closeDetails(event) {
      // Vérifiez si le clic se produit en dehors de tous les éléments <details>
      if (!event.target.closest('details')) {
        let detailsOpened = document.querySelectorAll(".toolbar-details");
        detailsOpened.forEach((item) => {
          item.removeAttribute("open");
        });
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDetails);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDetails);
  }
};
</script>
<style scoped>
#toolbar {
  border-top: var(--border);
  border-bottom: var(--border);
  display: flex;
  padding-left: 0.5rem;
  gap: 1rem;
  position: relative;
}
.toolbar-btn {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem 0;
  border-radius: 5px;
  user-select: none;
}
.toolbar-btn:hover,
.toolbar-menu li:hover {
  background: #f4f4f5;
  cursor: pointer;
}

.toolbar-menu {
  background-color: white;
  position: absolute;
  z-index: 1;
  margin-top: 5px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 200px;
}
.toolbar-menu li {
  list-style-type: none;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer;
}
.toolbar-toggle{
  display:flex;
  gap:0.5rem;
}
summary{
  list-style-type: none;
}
</style>
