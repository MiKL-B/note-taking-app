<template>
  <Titlebar name="Note" />
  <Toolbar
    @action-clicked="handleAction"
    @toggle-menu="toggleMenu"
    @toggle-notelist="toggleNoteList"
    @toggle-notebar="toggleNoteBar"
  />
  <div id="container">
    <div
      class="colonne col1"
      :style="{ flex: isVisibleNoteList ? '1' : '2' }"
      :class="{ invisible: !isVisibleMenu }"
    >
      <Menu />
    </div>
    <div class="colonne col2" :class="{ invisible: !isVisibleNoteList }">
      <div id="filter-note">
        <input type="search" placeholder="Filter notes..." />
      </div>

      <Notelist />
    </div>
    <div class="colonne col3" :style="{ flex: isVisibleNoteList ? '1' : '2' }">
      <div :class="{ invisible: !isVisibleNoteBar }">
        <Notebar />
      </div>

      <Note :style="{ height: noteHeight }" />
    </div>
  </div>
  <!-- <RouterLink to="/">go home</RouterLink> -->
  <!-- <RouterLink to="/about">about</RouterLink> -->
  <!-- <RouterView></RouterView> -->
  <Statusbar />
</template>
<script>
import { RouterLink } from "vue-router";
import Titlebar from "./components/Titlebar.vue";
import Toolbar from "./components/Toolbar.vue";
import Menu from "./components/Menu.vue";
import Notelist from "./components/Notelist.vue";
import Note from "./components/Note.vue";
import Statusbar from "./components/Statusbar.vue";
import Notebar from "./components/Notebar.vue";

export default {
  name: "App",
  components: {
    RouterLink,
    Titlebar,
    Toolbar,
    Menu,
    Notelist,
    Notebar,
    Note,
    Statusbar,
  },
  data() {
    return {
      isVisibleMenu: true,
      isVisibleNoteList: true,
      isVisibleNoteBar: true,
    };
  },
  computed: {
    noteHeight() {
      return this.isVisibleNoteBar ? 'calc(100% - 42px)' : '100%'; 
    }
  },
  methods: {
    handleAction(action) {
      switch (action) {
        case "new":
          this.createNewDocument();
          break;
        case "open":
          this.openDocument();
          break;
        case "save":
          this.saveDocument();
          break;
        case "undo":
          this.undoAction();
          break;
        case "redo":
          this.redoAction();
          break;
        case "cut":
          this.cutText();
          break;
        case "copy":
          this.copyText();
          break;
        case "paste":
          this.pasteText();
          break;
        default:
          alert(`Unknown action: ${action}`);
      }
    },
    createNewDocument() {
      alert("Creating a new document...");
    },
    openDocument() {
      alert("Opening a document...");
    },
    saveDocument() {
      alert("Saving the document...");
    },
    undoAction() {
      alert("Undoing the last action...");
    },
    redoAction() {
      alert("Redoing the last action...");
    },
    cutText() {
      alert("Cutting the selected text...");
    },
    copyText() {
      alert("Copying the selected text...");
    },
    pasteText() {
      alert("Pasting the text...");
    },
    toggleMenu(isVisible) {
      this.isVisibleMenu = isVisible;
    },
    toggleNoteList(isVisible) {
      this.isVisibleNoteList = isVisible;
    },
    toggleNoteBar(isVisible) {
      this.isVisibleNoteBar = isVisible;
    },
  },
};
</script>
<style>
#container {
  /* border: 1px solid red; */
  height: calc(100vh - 95px);
  display: flex;
}

.colonne {
  /* padding: 0.5rem; */
}
.col1 {
  min-width: 200px;
  max-width: 250px;
  background: var(--lightgrey);
  border-right: var(--border);
}
.col2 {
  border-right: var(--border);
}

.invisible {
  display: none;
}
#filter-note {
  border-bottom: var(--border);
  padding: 0.2rem;
}
</style>
