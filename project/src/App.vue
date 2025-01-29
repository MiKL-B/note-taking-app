<template>
  <Titlebar name="Note" />
  <Toolbar
    @action-clicked="handleAction"
    @toggle-menu="toggleMenu"
    @toggle-notelist="toggleNoteList"
    @toggle-notebar="toggleNoteBar"
    @toggle-markdownmode="toggleMarkdownMode"
  />
  <div id="container">
    <div
      class="colonne col1"
      :style="{ flex: isVisibleNoteList ? '1' : '2' }"
      :class="{ invisible: !isVisibleMenu }"
    >
      <Menubar
        :tags="tags"
        @select-tag="selectTag"
        @delete-tag="deleteTag"
        @update-tag-name="handleUpdateTagName"
      />
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
      <div class="sub-col3" :style="{ height: noteHeight }">
        <div id="col3-header-note">
          <input
            id="input-note-name"
            type="text"
            v-model="selectedNote.name"
            placeholder="Note name here..."
          />
          <select
            v-if="selectedNote"
            v-model="selectedNote.status"
            @change="changeNoteStatus"
          >
            <option disabled selected>Status</option>
            <option value="todo">Todo</option>
            <option value="inprogress">In progress</option>
            <option value="finished">Finished</option>
          </select>
          <input
            id="input-note-tag"
            v-if="selectedNote"
            type="text"
            @keyup.enter="addTagToNote"
            v-model="inputValue"
            placeholder="Add tags"
          />
          <button v-if="isMarkdownMode" @click="togglePreviewMode">
            <i class="fa-solid fa-eye-slash" v-if="isPreviewMode"></i>
            <i class="fa-solid fa-eye" v-else></i>
          </button>
        </div>
        <div class="note-tag-list" style="padding-left: 0.5rem">
          <span
            class="tag"
            v-for="tag in selectedNote.tags"
            :style="{ background: tag.color }"
            >{{ tag.name }}
            <span class="delete-tag-btn" @click="deleteTagNote(tag)"
              ><i class="fa-solid fa-xmark"></i
            ></span>
          </span>
        </div>
        <textarea
          v-model="selectedNote.content"
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
      isMarkdownMode: true,
      isPreviewMode: false,
      notes: [],
      status: "",
      searchNote: "",
      tags: [],
      inputValue: "",
    };
  },
  computed: {
    noteHeight() {
      return this.isVisibleNoteBar ? "calc(100% - 48px)" : "calc(100% - 5px)";
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
    toggleMarkdownMode(isMarkdownMode) {
      this.isMarkdownMode = isMarkdownMode;
    },
    togglePreviewMode() {
      this.isPreviewMode = !this.isPreviewMode;
    },
    // note
    createNote() {
      let newNote = {
        id: Date.now(),
        name: "New note",
        date: new Date().toLocaleString("fr-FR"),
        status: "todo",
        content: "",
        tags: [],
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
    changeNoteStatus() {
      this.status = this.selectedNote.status;
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
        for (let i = 0; i < this.notes.length; i++) {
          this.notes[i].tags = this.notes[i].tags.filter(
            (t) => t.id !== tag.id
          );
        }

        this.tags.splice(index, 1);
      }
    },
    addTagToNote() {
      const existingTag = this.tags.find(
        (t) => t.name.toLowerCase() === this.inputValue.toLowerCase()
      );
      if (!existingTag) {
        return;
      }

      const tagExistsInNote = this.selectedNote.tags.find(
        (t) => t.name.toLowerCase() === existingTag.name.toLowerCase()
      );
      if (tagExistsInNote) {
        return;
      }

      let newTag = {
        id: existingTag.id,
        name: existingTag.name,
        color: existingTag.color,
      };

      this.selectedNote.tags.push(newTag);
      this.inputValue = "";
    },
    deleteTagNote(tag) {
      const index = this.selectedNote.tags.findIndex((t) => t.id === tag.id);

      if (index > -1) {
        this.selectedNote.tags.splice(index, 1);
      }
    },
    handleUpdateTagName(updatedTag) {
      this.tags = this.tags.map((tag) => {
        return tag.id === updatedTag.id ? updatedTag : tag;
      });
      this.selectedNote.tags = this.selectedNote.tags.map((tag) => {
        return tag.id === updatedTag.id ? updatedTag : tag;
      });
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
  position: relative;
}
#col3-header-note {
  display: flex;
  padding: 0.2rem 0.2rem 0 0.2rem;
  gap: 0.2rem;
}
#input-note-tag {
  width: 100px;
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
.delete-tag-btn {
  cursor: pointer;
}
.note-tag-list {
  flex-wrap: wrap;
  overflow-y: scroll;
  max-height: 28px;
}
</style>
