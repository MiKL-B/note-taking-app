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
      <Menubar :tags="tags" @select-tag="selectTag" @delete-tag="deleteTag" />
    </div>
    <div class="colonne col2" :class="{ invisible: !isVisibleNoteList }">
      <div id="filter-note">
        <input
          type="text"
          v-model="searchNote"
          placeholder="Filter notes by name..."
        />
        <button @click="createNote"><i class="fa-solid fa-plus"></i></button>
      </div>

      <Notelist
        :notes="filteredNotes"
        @select-note="selectNote"
        @delete-note="deleteNote"
      />
    </div>
    <div class="colonne col3" :style="{ flex: isVisibleNoteList ? '1' : '2' }">
      <div v-if="selectedNote" :class="{ invisible: !isVisibleNoteBar }">
        <Notebar @change-status="changeNoteStatus" />
      </div>
      <div class="sub-col3" v-if="selectedNote">
        <input
          id="input-note-name"
          type="text"
          v-model="selectedNote.name"
          placeholder="Note name here..."
        />
        <textarea
          v-model="selectedNote.content"
          :style="{ height: noteHeight }"
          placeholder="Note content here..."
        ></textarea>
      </div>
    </div>
  </div>

  <Statusbar :noteLength="getContentNoteLength" />
</template>
<script>
import { RouterLink } from "vue-router";
import Titlebar from "./components/Titlebar.vue";
import Toolbar from "./components/Toolbar.vue";
import Menubar from "./components/Menubar.vue";
import Notelist from "./components/Notelist.vue";
import Statusbar from "./components/Statusbar.vue";
import Notebar from "./components/Notebar.vue";

export default {
  name: "App",
  components: {
    RouterLink,
    Titlebar,
    Toolbar,
    Menubar,
    Notelist,
    Notebar,
    Statusbar,
  },
  data() {
    return {
      isVisibleMenu: true,
      isVisibleNoteList: true,
      isVisibleNoteBar: true,
      notes: [],
      searchNote: "",
      tags: [],
    };
  },
  computed: {
    noteHeight() {
      return this.isVisibleNoteBar ? "calc(100% - 78px)" : "calc(100% - 36px)";
    },
    selectedNote() {
      const selectedNote = this.notes.find((note) => note.selected);
      return selectedNote ? selectedNote : "";
    },
    getContentNoteLength() {
      const selectedNote = this.notes.find((note) => note.selected);
      return selectedNote ? selectedNote.content.length : "";
    },
    getContentNoteLine() {
      let count = 0;
      const a = document.querySelector("textarea");
      for (let i = 0; i < this.selectedNote.content.length; i++) {
        if (this.selectedNote.content[i] == "\n") {
          count++;
        }
      }
      return count;
    },
    filteredNotes() {
      return this.notes.filter((note) => {
        return note.name.toLowerCase().includes(this.searchNote.toLowerCase());
      });
    },
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
    // note
    createNote() {
      let newNote = {
        id: Date.now(),
        name: "New note",
        date: new Date().toLocaleString("fr-FR"),
        status: "todo",
        content: "",
        selected: false,
      };
      this.notes.push(newNote);
    },
    selectNote(note) {
      this.notes.forEach((n) => {
        n.selected = false;
      });
      note.selected = true;
    },
    deleteNote(note) {
      const index = this.notes.findIndex((n) => n.id === note.id);

      if (index > -1) {
        this.notes.splice(index, 1);
      }
    },
    changeNoteStatus(newStatus) {
      this.selectedNote.status = newStatus;
    },
    // tag
    selectTag(tag) {
      this.tags.forEach((t) => {
        t.selected = false;
      });
      tag.selected = true;
    },
    deleteTag(tag) {
      const index = this.tags.findIndex((t) => t.id === tag.id);

      if (index > -1) {
        this.tags.splice(index, 1);
      }
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
  max-width: 200px;
  background: var(--lightgrey);
  border-right: var(--border);
}
.col2 {
  border-right: var(--border);
  max-width: 320px;
}
.sub-col3 {
  height: 100%;
}

.invisible {
  display: none;
}
#filter-note {
  border-bottom: var(--border);
  padding: 0.2rem;
  display: flex;
  justify-content: space-between;
  gap: 0.2rem;
}
#input-note-name {
  width: 100%;
  border: none;
  box-shadow: none;
  font-size: 20px;
}
</style>
