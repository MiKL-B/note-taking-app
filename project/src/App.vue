<template>
  <Titlebar :name="getDocumentName" />
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
        :countAllNotes="notes.length"
        :countTodo="getCountTodo"
        :countInProgress="getCountInProgress"
        :countFinished="getCountFinished"
        :countArchived="getCountArchived"
        @delete-tag="deleteTag"
        @update-tag-name="handleUpdateTagName"
        @select-filter="handleFilter"
        @set-color="setColorTag"
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

      <Notelist :notes="filteredNotes" @select-note="selectNote" />
    </div>
    <div
      class="colonne col3"
      :style="{ flex: isVisibleNoteList ? '1' : '2' }"
      v-if="selectedNote"
    >
      <div :class="{ invisible: !isVisibleNoteBar }">
        <Notebar @change-status="changeNoteStatus" />
      </div>
      <div class="sub-col3" :style="{ height: noteHeight }">
        <div id="col3-header-note">
          <div class="flex">
            <div
              id="col3-header-status"
              class="color-circle"
              :class="`bg-${selectedNote.color}`"
            ></div>
            <input
              id="input-note-name"
              type="text"
              v-model="selectedNote.name"
              placeholder="Note name here..."
            />
          </div>
          <div class="flex gap-4">
        
            <details v-if="isVisibleMenu" class="toolbar-details">
              <summary class="app-btn">Add tag</summary>
              <ul class="toolbar-menu">
                <li
                  class="flex gap-4 align-center"
                  v-for="tag in tags"
                  :key="tag.id"
                  @click="addTagToNote(tag)"
                >
                  <i
                    class="fa-solid fa-tag"
                    :style="` color: var(--${tag.color} `"
                  ></i>
                  <span>{{ tag.name }}</span>
                </li>
              </ul>
            </details>
            <select v-model="selectedNote.status" @change="changeNoteStatus">
              <option disabled selected>Status</option>
              <option value="todo">Todo</option>
              <option value="inprogress">In progress</option>
              <option value="finished">Finished</option>
              <option value="archived">Archived</option>
            </select>

            <button v-if="isMarkdownMode" @click="togglePreviewMode">
              <i class="fa-solid fa-eye-slash" v-if="isPreviewMode"></i>
              <i class="fa-solid fa-eye" v-else></i>
            </button>
          </div>
        </div>
        <div class="note-tag-list">
          <span
            class="tag"
            v-for="tag in selectedNote.tags"
            :style="` background: var(--${tag.color} `"
            >{{ tag.name }}
            <span class="delete-tag-btn" @click="deleteTagNote(tag)"
              ><i class="fa-solid fa-xmark"></i
            ></span>
          </span>
        </div>
        <div
          id="textedit-preview"
          v-if="isPreviewMode && isMarkdownMode"
          v-html="getMarkdownHtml()"
          style="height: calc(100% - 55px)"
        ></div>
        <textarea
          v-else
          class="contentToExport"
          v-model="selectedNote.content"
          placeholder="Note content here..."
        ></textarea>
      </div>
    </div>
    <div class="colonne col3" v-else>
      <textarea
        class="contentToExport"
        style="height: calc(100% - 110px)"
        placeholder="Enter text here..."
      ></textarea>
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
import { marked } from "marked";
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
      color: "",
      searchNote: "",
      tags: [],
      noteCounters: {},
      filter: "",
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
      console.log(this.filter);
      switch (this.filter) {
        case "todo":
          return this.notes.filter((note) => note.status === "todo");
        case "inprogress":
          return this.notes.filter((note) => note.status === "inprogress");
        case "finished":
          return this.notes.filter((note) => note.status === "finished");
        case "archived":
          return this.notes.filter((note) => note.status === "archived");
        case "":
        case "allnotes":
          return this.notes.filter((note) => {
            return note.name
              .toLowerCase()
              .includes(this.searchNote.toLowerCase());
          });
        default:
          return this.notes.filter((note) => {
            return note.tags.some((tag) =>
              tag.name.toLowerCase().includes(this.filter.toLowerCase())
            );
          });
      }
    },
    getCountTodo() {
      return this.notes.filter((note) => note.status === "todo").length;
    },
    getCountInProgress() {
      return this.notes.filter((note) => note.status === "inprogress").length;
    },
    getCountFinished() {
      return this.notes.filter((note) => note.status === "finished").length;
    },
    getCountArchived() {
      return this.notes.filter((note) => note.status === "archived").length;
    },
    getDocumentName() {
      let name = "Untitled";
      let extension = ".txt";
      if (this.selectedNote) {
        name = this.selectedNote.name;
      }
      if (this.isMarkdownMode && this.selectedNote) {
        extension = ".md";
      }
      return name + extension;
    },
  },

  methods: {
    handleFilter(filter) {
      this.filter = filter;
    },
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
        case "export":
          this.exportASPDF();
          break;
        default:
          alert(`Unknown action: ${action}`);
          break;
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
    generateIncrementedName(baseTitle) {
      if (!this.noteCounters[baseTitle]) {
        this.noteCounters[baseTitle] = 1;
      } else {
        this.noteCounters[baseTitle] += 1;
      }
      return `${baseTitle} ${this.noteCounters[baseTitle]}`;
    },
    // note
    createNote() {
      let newNote = {
        id: Date.now(),
        name: this.generateIncrementedName("New note"),
        date: new Date().toLocaleString("fr-FR"),
        status: "todo",
        color: "red",
        content: "",
        tags: [],
        selected: false,
        deleted: false,
      };
      this.notes.push(newNote);
    },
    selectNote(note) {
      if (note.selected) {
        note.selected = false;
      } else {
        this.notes.forEach((n) => {
          n.selected = false;
        });
        note.selected = true;
      }
    },

    changeNoteStatus() {
      this.status = this.selectedNote.status;
      switch (this.status) {
        case "todo":
          this.color = "red";
          break;
        case "inprogress":
          this.color = "yellow";
          break;
        case "finished":
          this.color = "green";
          break;
        case "archived":
          this.color = "grey";
          break;
      }
      this.selectedNote.color = this.color;
    },

    // tag
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
    addTagToNote(tag) {
      const existingTag = this.selectedNote.tags.find(
        (t) => t.name.toLowerCase() === tag.name.toLowerCase()
      );
      if (existingTag) {
        return;
      }

      this.selectedNote.tags.push(tag);
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
      for (let i = 0; i < this.notes.length; i++) {
        for (let j = 0; j < this.notes[i].tags.length; j++) {
          this.notes[i].tags = this.notes[i].tags.map((tag) => {
            return tag.id === updatedTag.id ? updatedTag : tag;
          });
        }
      }
    },
    setColorTag(tag, color) {
      const index = this.tags.findIndex((t) => t.id === tag.id);
      this.tags[index].color = color;
    },
    // markdown
    getMarkdownHtml() {
      return marked(this.selectedNote.content, { sanitize: true });
    },
    // exportASPDF
    exportASPDF() {
      let name = this.selectedNote.name || "Untitled";
      let extension = ".pdf";
      const element = document.querySelector(".contentToExport");
      console.log(element);
      const opt = {
        filename: name,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      // Générer le PDF
      html2pdf().from(element).set(opt).save();
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
  justify-content: space-between;
}
#col3-header-status {
  width: 12px;
  height: 14px;
  padding: 0 0.4rem;
  margin: auto;
  display: inline-block;
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
  display: flex;
  gap: 0.2rem;
  padding-left: 0.2rem;
}
#textedit-preview {
  margin: 1rem;
  overflow-y: scroll;
}
.flex {
  display: flex;
}
.gap-4 {
  gap: 0.2rem;
}
.align-center {
  align-items: center;
}

</style>
