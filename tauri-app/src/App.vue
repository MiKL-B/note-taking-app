<template>
  <div id="home-container">
    <Titlebar @close-app="closeApplication" />
    <Toolbar
      @action-clicked="handleAction"
      @select-view="selectView"
      :distractionFree="selectedNote"
    />
    <div class="row">
      <div
        id="column-left"
        class="col-3"
        v-if="currentView !== 'distraction_free'"
      >
        <Sidebar
          :tags="tags"
          :counters="getCountNotes"
          @delete-tag="deleteTag"
          @update-tag-name="handleUpdateTagName"
          @select-filter="handleFilter"
          @set-color="setColorTag"
        />
      </div>
      <div
        id="column-middle"
        class="col-3"
        v-if="currentView !== 'distraction_free'"
      >
        <NoteFilter
          :canCreateNote="canCreateNote"
          v-model="searchNote"
          @create-note="createNote"
          @sort-notes-AZ="toggleSortAZ"
          @sort-notes-date="toggleSortByDate"
          @sort-notes-clear="clearFilterSort"
        />
        <Notelist
          :notes="filteredNotes"
          :selectedNote="selectedNote"
          @select-note="selectNote"
          @delete-note="deleteNote"
          @restore-note="restoreNote"
          @create-note="createNote"
          @duplicate-note="duplicateNote"
          @toggle-pin-note="togglePinNote"
          :isPinned="selectedNote.pinned"
        />
      </div>
      <div id="column-right" class="col-6" v-if="selectedNote">
        <Notebar
          :tags="tags"
          :showBoth="showBoth"
          @add-tag-note="addTag"
          @toggle-preview-mode="togglePreviewMode"
          @toggle-showboth="toggleShowBothTextareaPreview"
          @duplicate-note="duplicateNote"
          @update-status="changeNoteStatus"
          @toggle-pin-note="togglePinNote"
          @toggle-important-note="toggleImportantNote"
          :isPinned="selectedNote.pinned"
          :isImportant="selectedNote.important"
          v-model.modelValue="selectedNote.status_ID"
          @insert-item="insertItem"
        />
        <Note
          :isPreviewMode="isPreviewMode"
          :showBoth="showBoth"
          :selectedNote="selectedNote"
          :notes="notes"
          @delete-tag-note="deleteTagNote"
          @mark-as-modified="markAsModified"
          @get-position-cursor="getCursor"
        />
      </div>
      <div class="column-note img" v-else>
        <img src="/image-no-notes.png" />
      </div>
    </div>
  </div>
  <Notification
    :message="messageNotification"
    :color="colorNotification"
    :showNotification="isVisibleNotification"
  />
</template>

<script lang="ts">
// component
import Titlebar from "./components/Titlebar.vue";
import Toolbar from "./components/Toolbar.vue";
import Sidebar from "./components/Sidebar.vue";
import NoteFilter from "./components/NoteFilter.vue";
import Notelist from "./components/Notelist.vue";
import Notebar from "./components/Notebar.vue";
import Note from "./components/Note.vue";
import Notification from "./components/Notification.vue";

// service
import initializeDatabase from "./service/database/index.js";
import NoteService from "./service/database/NoteService.js";
import { initLogFile, writeLog } from "./service/log/index.js";

// tauri api
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { join, desktopDir } from "@tauri-apps/api/path";
const appWindow = getCurrentWindow();

export default {
  name: "App",
  components: {
    Titlebar,
    Toolbar,
    Sidebar,
    NoteFilter,
    Notelist,
    Notebar,
    Note,
    Notification,
  },
  data() {
    return {
      isPreviewMode: false,
      showBoth: false,
      notes: [],
      tempNotes: [],
      color: "",
      searchNote: "",
      tags: [],
      noteCounters: {},
      filter: "",
      timerNotification: null,
      isVisibleNotification: false,
      messageNotification: "",
      colorNotification: "",
      sortedAsc: true,
      sortedDate: true,
      timerCreateNote: null,
      canCreateNote: true,
      currentView: "",
      noteCount: 0,
      jsonData: {},
      tagsNote: [],
      currentPosition: 0,

    };
  },
  async mounted() {
    initializeDatabase();
    this.notes = await NoteService.getNotes();
    window.addEventListener("keydown", this.handleKeyDown);
  },
  computed: {
    selectedNote() {
      const selectedNote = this.notes.find((note: Note) => note.selected);
      return selectedNote ? selectedNote : "";
    },

    // -------------------------------------------------------------------------
    filteredNotes() {
      switch (this.filter) {
        case "todo":
          return this.notes.filter((note) => note.status_ID === 1);
        case "inprogress":
          return this.notes.filter((note) => note.status_ID === 2);
        case "finished":
          return this.notes.filter((note) => note.status_ID === 3);
        case "archived":
          return this.notes.filter((note) => note.status_ID === 4);
        case "trash":
          return this.notes.filter((note) => note.deleted === 1);
        case "":
        case "allnotes":
          return this.notes.filter((note) => {
            return (
              note.name.toLowerCase().includes(this.searchNote.toLowerCase()) &&
              note.deleted === 0
            );
          });
        case "pinned":
          return this.notes.filter((note) => note.pinned === 1);
        case "today":
          return this.notes.filter(
            (note) =>
              new Date(note.timestamp).toLocaleString("fr-FR").split(" ")[0] ===
              this.getToday(),
          );
        case "important":
          return this.notes.filter((note) => note.important === 1);
        default:
          return this.notes.filter((note) => {
            return note.name
              .toLowerCase()
              .includes(this.searchNote.toLowerCase());
          });
        // default:
        //   return this.notes.filter((note) => {
        //     return note.tags.some((tag) =>
        //       tag.name.toLowerCase().includes(this.filter.toLowerCase()),
        //     );
        //   });
      }
    },
    // -------------------------------------------------------------------------
    getCountNotes() {
      return {
        allNotes: this.notes.filter((note) => {
          return (
            note.name.toLowerCase().includes(this.searchNote.toLowerCase()) &&
            note.deleted === 0
          );
        }).length,
        todo: this.notes.filter((note) => note.status_ID === 1).length,
        inProgress: this.notes.filter((note) => note.status_ID === 2).length,
        finished: this.notes.filter((note) => note.status_ID === 3).length,
        archived: this.notes.filter((note) => note.status_ID === 4).length,
        trash: this.notes.filter((note) => note.deleted === 1).length,
        pinned: this.notes.filter((note) => note.pinned === 1).length,
        today: this.notes.filter(
          (note) =>
            new Date(note.timestamp).toLocaleString("fr-FR").split(" ")[0] ===
            this.getToday(),
        ).length,
        important: this.notes.filter((note) => note.important === 1).length,
      };
    },
  },
  methods: {
    selectView(newView: string) {
      writeLog("[BEGIN FUNCTION]: selectView(newView)");
      this.currentView = newView;
      writeLog("[END FUNCTION]: selectView(newView)");
    },
    // -------------------------------------------------------------------------
    getCursor(position) {
      this.currentPosition = position;
    },
    // -------------------------------------------------------------------------
    insertItem(item: string) {
      let textarea = document.getElementById("textContent");
      let cursorPosition = this.currentPosition;
      if (cursorPosition === 0) {
        textarea.value += "\r\n";
        cursorPosition = textarea.value.length;
      }

      textarea.value =
        textarea.value.slice(0, cursorPosition) +
        item +
        textarea.value.slice(cursorPosition);
      this.selectedNote.content = textarea.value;
      this.currentPosition = 0;
      this.selectedNote.isSaved = 0;
    },
    // -------------------------------------------------------------------------
    getToday() {
      return new Date().toLocaleString("fr-FR").split(" ")[0];
    },
    // -------------------------------------------------------------------------
    sortNotes() {
      this.notes.sort((a: Note, b: Note) => {
        if (a.name < b.name) {
          return -1;
        } else if (b.name < a.name) {
          return 1;
        }
        return 0;
      });
    },
    // -------------------------------------------------------------------------
    sortNotesDate() {
      this.notes.sort((a, b) => {
        if (this.sortedDate) {
          return a.timestamp - b.timestamp;
        } else {
          return b.timestamp - a.timestamp;
        }
      });
    },
    // -------------------------------------------------------------------------
    toggleSortAZ() {
      this.sortedAsc = !this.sortedAsc;
      this.sortNotes();
      if (!this.sortedAsc) {
        this.notes.reverse();
      }
    },
    // -------------------------------------------------------------------------
    clearFilterSort() {
      this.sortedAsc = true;
      this.sortedDate = true;
      this.sortNotesDate();
    },
    // -------------------------------------------------------------------------
    toggleSortByDate() {
      this.sortedDate = !this.sortedDate;
      this.sortNotesDate();
    },
    // -------------------------------------------------------------------------
    togglePreviewMode() {
      this.isPreviewMode = !this.isPreviewMode;
    },
    // -------------------------------------------------------------------------
    toggleShowBothTextareaPreview() {
      this.showBoth = !this.showBoth;
    },
    // -------------------------------------------------------------------------
    handleFilter(filter: string) {
      this.filter = filter;
    },
    // -------------------------------------------------------------------------
    handleAction(action: string) {
      switch (action) {
        case "newnote":
          this.createNote();
          break;
        case "duplicate_note":
          this.duplicateNote();
          break;
        case "opennotedemo":
          this.openNoteDemo();
          break;
        case "save":
          this.saveFile(this.selectedNote);
          break;
        case "exportjson":
          this.exportJSON();
          break;
        case "importjson":
          this.importJSON();
          break;
        case "exit":
          this.closeApplication();
          break;
        default:
          alert(`Unknown action: ${action}`);
          break;
      }
    },
    // -------------------------------------------------------------------------
    async openNoteDemo() {
      writeLog("[BEGIN FUNCTION]: openNoteDemo()");
      const selectedFile = "/Thoth demo.txt";
      const fileName = selectedFile
        .replace(/^.*[\\\/]/, "")
        .replace(/\.[^/.]+$/, "");
      fetch(selectedFile)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération du fichier");
          }
          writeLog("[END FUNCTION]: openNoteDemo()");
          return response.text();
        })
        .then(async (content) => {
          const allNotes = await NoteService.getNotes();

          if (this.selectedNote.selected) {
            this.selectedNote.isSaved = 1;
            await NoteService.updateNote(this.selectedNote);
          }
          await NoteService.createNote(fileName, content);
          this.notes = await NoteService.getNotes();
        })
        .catch((error) => {
          console.log(error);
          this.showNotification(error, "red");
        });
      writeLog("[END FUNCTION]: openNoteDemo()");
    },
    // -------------------------------------------------------------------------
    markAsModified(position) {
      this.currentPosition = position;
      this.selectedNote.isSaved = 0;
    },
    // -------------------------------------------------------------------------
    async createNote() {
      writeLog("[BEGIN FUNCTION]: createNote");
      const allNotes = await NoteService.getNotes();

      if (this.selectedNote.selected) {
        this.selectedNote.isSaved = 1;
        await NoteService.updateNote(this.selectedNote);
      }
      await NoteService.createNote();
      this.notes = await NoteService.getNotes();
      let note = await NoteService.getLastNote();

      this.showNotification(
        this.$t("note_created", { note_name: note.name }),
        "green",
      );
      this.setDelayCreationNote();
      writeLog("[END FUNCTION]: createNote");
    },
    // -------------------------------------------------------------------------
    async saveFile(note) {
      writeLog("[BEGIN FUNCTION]: saveFile(note)");
      this.selectedNote.isSaved = 1;
      await NoteService.updateNote(note);
      this.showNotification(
        this.$t("note_saved", { note_name: note.name }),
        "green",
      );
      writeLog("[END FUNCTION]: saveFile(note)");
    },
    // -------------------------------------------------------------------------
    handleKeyDown(event) {
      // for mac event.metaKey
      // New note Ctrl + N
      if (event.ctrlKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        this.createNote();
      }

      // New note Ctrl + D
      if (event.ctrlKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        this.duplicateNote();
      }

      // Save Ctrl + S
      if (this.selectedNote) {
        if (event.ctrlKey && event.key.toLowerCase() === "s") {
          event.preventDefault();
          this.saveFile(this.selectedNote);
        }
      }

      // Quit Ctrl + Q
      if (event.ctrlKey && event.key.toLowerCase() === "q") {
        event.preventDefault();
        this.closeApplication();
      }
    },
    // -------------------------------------------------------------------------
    async closeApplication() {
      writeLog("[BEGIN FUNCTION]: closeApplication()");
      let isNoteUnsaved = false;
      for (let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].isSaved === 0) {
          isNoteUnsaved = true;
          break;
        }
      }
      if (!isNoteUnsaved) {
        writeLog("[END FUNCTION]: closeApplication()");
        appWindow.close();
        return;
      }
      let msgConfirm = this.$t("confirm_close_app");
      const confirmed = await confirm(msgConfirm);
      if (!confirmed) {
        writeLog("[END FUNCTION]: closeApplication()");
        return;
      }
      writeLog("[END FUNCTION]: closeApplication()");
      appWindow.close();
    },
    // -------------------------------------------------------------------------
    setDelayCreationNote() {
      const duration = 500;
      this.canCreateNote = false;
      this.timerCreateNote = setTimeout(() => {
        this.canCreateNote = true;
      }, duration);
    },
    // -------------------------------------------------------------------------
    async togglePinNote() {
      writeLog("[BEGIN FUNCTION]: togglePinNote()");
      this.selectedNote.pinned ^= 1;
      await NoteService.updateNote(this.selectedNote);
      writeLog("[END FUNCTION]: togglePinNote()");
    },
    // -------------------------------------------------------------------------
    async toggleImportantNote() {
      writeLog("[BEGIN FUNCTION]: toggleImportantNote()");
      this.selectedNote.important ^= 1;
      await NoteService.updateNote(this.selectedNote);
      writeLog("[END FUNCTION]: toggleImportantNote()");
    },
    // -------------------------------------------------------------------------
    async duplicateNote() {
      writeLog("[BEGIN FUNCTION]: duplicateNote()");
      if (!this.selectedNote) {
        this.showNotification(this.$t("no_note_selected"), "red");
        writeLog("[END FUNCTION]: duplicateNote()");
        return;
      }
      const allNotes = await NoteService.getNotes();

      if (this.selectedNote.selected) {
        this.selectedNote.isSaved = 1;
        await NoteService.updateNote(this.selectedNote);
      }
      await NoteService.duplicateNote(this.selectedNote);
      this.notes = await NoteService.getNotes();

      this.showNotification(
        this.$t("note_duplicated", {
          note_name: this.selectedNote.name,
        }),
        "green",
      );
      this.setDelayCreationNote();
      writeLog("[END FUNCTION]: duplicateNote()");
    },
    // -------------------------------------------------------------------------
    showNotification(message: string, color: string) {
      this.isVisibleNotification = true;
      this.messageNotification = message;
      this.colorNotification = color;
      const duration = 4000;
      this.timerNotification = setTimeout(() => {
        this.isVisibleNotification = false;
      }, duration);
    },
    // -------------------------------------------------------------------------
    async selectNote(note) {
      writeLog("[BEGIN FUNCTION]: selectNote(note)");
      const allNotes = await NoteService.getNotes();

      if (this.selectedNote.selected) {
        this.selectedNote.isSaved = 1;
        await NoteService.updateNote(this.selectedNote);
      }

      await NoteService.unselectNotes();
      console.log("selected", this.selectedNote);
      await NoteService.selectNote(note);
      this.notes = await NoteService.getNotes();
      writeLog("[END FUNCTION]: selectNote(note)");
    },
    // -------------------------------------------------------------------------
    async deleteNote(note) {
      writeLog("[BEGIN FUNCTION]: deleteNote(note)");
      if (note.deleted === 1) {
        writeLog("[END FUNCTION]: deleteNote(note)");
        return;
      }
      let msgConfirm = this.$t("confirm_note_deleted", {
        note_name: note.name,
      });
      const confirmed = await confirm(msgConfirm);

      if (!confirmed) {
        writeLog("[END FUNCTION]: deleteNote(note)");
        return;
      }

      try {
        await NoteService.moveToTrash(note);
        this.notes = await NoteService.getNotes();
        let msgDeleted = this.$t("note_deleted", {
          note_name: note.name,
        });
        this.showNotification(msgDeleted, "green");
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      writeLog("[END FUNCTION]: deleteNote(note)");
    },
    // -------------------------------------------------------------------------
    async restoreNote(note) {
      writeLog("[BEGIN FUNCTION]: restoreNote(note)");
      let msgConfirm = this.$t("confirm_note_restored", {
        note_name: note.name,
      });
      const confirmed = await confirm(msgConfirm);

      if (!confirmed) {
        writeLog("[END FUNCTION]: restoreNote(note)");
        return;
      }

      try {
        await NoteService.restoreNote(note);
        this.notes = await NoteService.getNotes();
        let msgRestored = this.$t("note_restored", {
          note_name: note.name,
        });
        this.showNotification(msgRestored, "green");
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      writeLog("[END FUNCTION]: restoreNote(note)");
    },
    // -------------------------------------------------------------------------
    async changeNoteStatus(newStatus) {
      writeLog(
        this.logFilePath,
        "[BEGIN FUNCTION]: changeNoteStatus(newStatus)",
      );
      this.selectedNote.status_ID = parseInt(newStatus);
      await NoteService.updateNote(this.selectedNote);
      writeLog("[END FUNCTION]: changeNoteStatus(newStatus)");
    },
    // -------------------------------------------------------------------------
    async deleteTag(tag) {
      console.log(tag);

      // await DatabaseService.deleteTag(tag);
      // this.tags = await DatabaseService.getTags();

      // this.tags = await DatabaseService.getTags()
      // const index = this.tags.findIndex((t) => t.id === tag.id);

      // if (index > -1) {
      //   for (let i = 0; i < this.notes.length; i++) {
      //     this.notes[i].tags = this.notes[i].tags.filter(
      //       (t) => t.id !== tag.id,
      //     );
      //   }

      //   this.tags.splice(index, 1);
      //   let msgDeleted = this.$t("tag_deleted", { tag_name: tag.name });
      //   this.showNotification(msgDeleted, "green");
      // }
    },
    // -------------------------------------------------------------------------
    async addTag(tagName) {
      // await DatabaseService.createTag(tag);
      // this.tags = await DatabaseService.getTags();
      // console.log(tag.tags_ID);
      // await DatabaseService.createTagNote(this.selectedNote, tag);
      // await DatabaseService.getNoteTags();

      try {
        // Étape 1 : Créer le nouveau tag. Cela renvoie l'ID du tag créé.
        // await DatabaseService.createTag(tagName);
        // Étape 2 : Récupérer le tag que vous venez de créer
        // const tags = await DatabaseService.getTags();
        // this.tags = tags;
        // const newTag = tags.find((tag) => tag.name === tagName); // Assurez-vous que c'est unique.
        // if (!newTag) {
        //   throw new Error("Tag not found after creation.");
        // }
        // Étape 3 : Associer le tag à la note
        // const tagtoadd = {
        //   tags_ID: newTag.tags_ID,
        // };
        // const note = {
        //   note_ID: this.selectedNote.note_ID,
        // };
        // await DatabaseService.createTagNote(this.selectedNote, tagtoadd);
        // const tagsTemp = await DatabaseService.getNoteTags();
        // this.tagsNote = tagsTemp.filter(
        //   (tag) => tag.note_ID === this.selectedNote.note_ID,
        // );
        // let tagsNote = await DatabaseService.getNoteTags();
        // console.log("notelist", tags);
        // console.log("tags note", tagsNote);
        // for (let i = 0; i < this.notes.length; i++) {
        //   for (let j = 0; j < tagsNote[i].length; j++) {
        //     console.log(this.notes[i].note_ID)
        //     if (this.notes[i].note_ID === tagsNote[j].note_ID) {
        //       this.tagsNote = tagsNote;
        //       console.log("notelist", this.tagsNote);
        //     }
        //   }
        // }
      } catch (error) {
        console.log(error);
        throw error;
      }
      // const word = tag.trim();
      // const pattern = /^[a-zA-ZÀ-ÿ]+$/;
      // let tagtoAdd = {
      //   id: Date.now(),
      //   name: word,
      //   color: "blue",
      //   selected: false,
      // };

      // const existingTag = this.tags.find(
      //   (t) => t.name.toLocaleString() === word.toLowerCase(),
      // );
      // const existingTagNote = this.selectedNote.tags.find(
      //   (t) => t.name.toLowerCase() === word.toLowerCase(),
      // );
      // if (!pattern.test(word)) {
      //   return;
      // }
      // if (!existingTag) {
      //   this.tags.push(tagtoAdd);
      //   this.selectedNote.tags.push(tagtoAdd);
      //   let msgCreated = this.$t("tag_created", {
      //     tag_name: tagtoAdd.name,
      //   });
      //   this.showNotification(msgCreated, "green");
      //   return;
      // }
      // tagtoAdd.color = existingTag.color;
      // tagtoAdd.id = existingTag.id;
      // if (!existingTagNote) {
      //   this.selectedNote.tags.push(tagtoAdd);
      //   return;
      // }
    },

    // -------------------------------------------------------------------------
    deleteTagNote(tag) {
      const index = this.selectedNote.tags.findIndex((t) => t.id === tag.id);
      if (index > -1) {
        this.selectedNote.tags.splice(index, 1);
      }
    },
    // -------------------------------------------------------------------------
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
    // -------------------------------------------------------------------------
    setColorTag(tag, color) {
      const index = this.tags.findIndex((t) => t.id === tag.id);

      for (let i = 0; i < this.notes.length; i++) {
        for (let j = 0; j < this.notes[i].tags.length; j++) {
          if (this.notes[i].tags[j].id === tag.id) {
            this.notes[i].tags[j].color = color;
          }
        }
      }
      this.tags[index].color = color;
    },
    // -------------------------------------------------------------------------
    // exportASPDF() {
    //   let name = this.selectedNote.name || "Untitled";
    //   const element = document.querySelector(".contentToExport");
    //   console.log(element);
    //   const opt = {
    //     filename: name,
    //     image: { type: "jpeg", quality: 0.98 },
    //     html2canvas: { scale: 2 },
    //     jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
    //   };

    //   html2pdf().from(element).set(opt).save();
    // },
    // -------------------------------------------------------------------------
    async exportJSON() {
      writeLog("[BEGIN FUNCTION]: exportJSON()");
      let data = {
        notes: this.notes,
        tags: this.tags,
      };
      if (data.notes.length === 0 && data.tags.length === 0) {
        this.showNotification(this.$t("no_data_to_export"), "red");
        writeLog("[END FUNCTION]: exportJSON()");
        return;
      }

      const json = JSON.stringify(data);
      try {
        const path = await save({
          filters: [{ name: "Fichiers texte", extensions: ["json"] }],
        });
        if (path) {
          await writeTextFile(path, json);
          this.showNotification(this.$t("data_exported"), "green");
        }
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      writeLog("[END FUNCTION]: exportJSON()");
    },
    // -------------------------------------------------------------------------
    async importJSON() {
      writeLog("[BEGIN FUNCTION]: importJSON()");
      const selectedFile = await open({
        multiple: false,
        filters: [{ name: "Fichiers texte", extensions: ["json"] }],
      });
      if (!selectedFile) {
        writeLog("[END FUNCTION]: importJSON()");
        return;
      }

      try {
        const content = await readTextFile(selectedFile);
        const jsonParsed = JSON.parse(content);
        let items = [];
        jsonParsed.notes.forEach((note) => {
          items.push(note);
        });
        for (let i = 0; i < items.length; i++) {
          await NoteService.createNote(
            items[i].name,
            items[i].content,
            items[i].timestamp,
            items[i].isSaved,
            items[i].status_ID,
            items[i].pinned,
            items[i].important,
            items[i].selected,
            items[i].deleted,
          );
        }

        this.notes = await NoteService.getNotes();
        // jsonParsed.tags.forEach((tag) => {
        //   this.tags.push(tag);
        // });

        this.showNotification(this.$t("data_imported"), "green");
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      writeLog("[END FUNCTION]: importJSON()");
    },
  },
  beforeDestroy() {
    window.addEventListener("keydown", this.handleKeyDown);
    clearTimeout(this.timerNotification);
    clearTimeout(this.timerCreateNote);
  },
};
</script>
<style>
#home-container {
  height: 100%;
  display: grid;
  grid-template-rows: 33px 33px 1fr;
}
.row {
  display: flex;
  height: 100%;
}
#column-left {
  min-width: 150px;
  max-width: 200px;
}
#column-middle {
  max-width: 263.5px;
  width: 263.5px;
  display: grid;
  grid-template-rows: 42px calc(100vh - 108px);
  border-right: var(--border);
  background: var(--bg-notelist);
  color: var(--text-color-notelist);
}

#column-right {
  flex-grow: 1;
  display: grid;
  grid-template-rows: 42px calc(100vh - 108px);
}

.col-3 {
  width: 25%;
}

.col-6 {
  width: 50%;
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
.img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  user-select: none;
}

.app-btn.disabled,
.disabled {
  color: var(--text-color-button-disabled);
  cursor: not-allowed !important;
  user-select: none;
}
</style>
