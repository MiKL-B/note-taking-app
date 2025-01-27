<template>
  <Titlebar name="Note" />
  <Toolbar @action-clicked="handleAction" @toggle-notelist="toggleNoteList" />
  <div id="container">
    <div class="colonne col1" :style="{ flex: isVisibleNoteList ? '1' : '2' }">
      <Menu />
    </div>
    <div class="colonne col2" :class="{ invisible: !isVisibleNoteList }">
      <input type="search" placeholder="Filter notes..." />

      <Notelist />
    </div>
    <div class="colonne" :style="{ flex: isVisibleNoteList ? '1' : '2' }">
      <p>Notebar</p>
      <Note />
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


export default {
  name: "App",
  components: {
    RouterLink,
    Titlebar,
    Toolbar,
    Menu,
    Notelist,
    Note,
    Statusbar,

  },
  data() {
    return {
      isVisibleNoteList: true,
    };
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
    toggleNoteList(isVisible) {
      this.isVisibleNoteList = isVisible;
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
  padding: 0.5rem;
}
.col1 {
  max-width: 200px;
  background: var(--lightgrey);
  border-right: var(--border);
}
.col2 {
  border-right: var(--border);
}
.invisible {
  display: none;
}
</style>
