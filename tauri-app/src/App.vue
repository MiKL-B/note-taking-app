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
          :tags="noteTags"
          :selectedNote="selectedNote"
          @select-note="selectNote"
          @delete-note="deleteNote"
          @restore-note="restoreNote"
          @delete-note-permanent="deleteNotePermanent"
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
          :tags="noteTags"
          @delete-note-tag="deleteNoteTag"
          @mark-as-modified="markAsModified"
          @get-position-cursor="getCursor"
        />
      </div>
      <div id="column-img" v-else>
        <img class="img" src="/image-no-notes.png" />
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
import TagService from "./service/database/TagService.js";
import NoteTagService from "./service/database/NoteTagService.js";
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
      noteTags: [],
      currentPosition: 0,
      tagsNoteTemp: [],
    };
  },
  async mounted() {
    initializeDatabase();
    this.notes = await NoteService.getNotes();
    this.tags = await TagService.getTags();

    this.noteTags = await NoteTagService.getNoteTags();
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
          return this.notes.filter(
            (note) => note.status_ID === 1 && note.deleted === 0,
          );
        case "inprogress":
          return this.notes.filter(
            (note) => note.status_ID === 2 && note.deleted === 0,
          );
        case "finished":
          return this.notes.filter(
            (note) => note.status_ID === 3 && note.deleted === 0,
          );
        case "archived":
          return this.notes.filter(
            (note) => note.status_ID === 4 && note.deleted === 0,
          );
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
          return this.notes.filter(
            (note) => note.pinned === 1 && note.deleted === 0,
          );
        case "today":
          return this.notes.filter(
            (note) =>
              new Date(note.timestamp).toLocaleString("fr-FR").split(" ")[0] ===
                this.getToday() && note.deleted === 0,
          );
        case "important":
          return this.notes.filter(
            (note) => note.important === 1 && note.deleted === 0,
          );
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
        todo: this.notes.filter(
          (note) => note.status_ID === 1 && note.deleted === 0,
        ).length,
        inProgress: this.notes.filter(
          (note) => note.status_ID === 2 && note.deleted === 0,
        ).length,
        finished: this.notes.filter(
          (note) => note.status_ID === 3 && note.deleted === 0,
        ).length,
        archived: this.notes.filter(
          (note) => note.status_ID === 4 && note.deleted === 0,
        ).length,
        trash: this.notes.filter((note) => note.deleted === 1).length,
        pinned: this.notes.filter(
          (note) => note.pinned === 1 && note.deleted === 0,
        ).length,
        today: this.notes.filter(
          (note) =>
            new Date(note.timestamp).toLocaleString("fr-FR").split(" ")[0] ===
              this.getToday() && note.deleted === 0,
        ).length,
        important: this.notes.filter(
          (note) => note.important === 1 && note.deleted === 0,
        ).length,
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
      writeLog(`[BEGIN FUNCTION]: handleFilter(filter: ${filter})`);
      this.filter = filter;
      writeLog(`[END FUNCTION]: handleFilter(filter: ${filter})`);
    },
    // -------------------------------------------------------------------------
    handleAction(action: string) {
      writeLog(`[BEGIN FUNCTION]: handleAction(action: ${action})`);
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
      writeLog(`[END FUNCTION]: handleAction(action: ${action})`);
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
      writeLog("[BEGIN FUNCTION]: markAsModified(position)");
      this.currentPosition = position;
      this.selectedNote.isSaved = 0;
      writeLog("[END FUNCTION]: markAsModified(position)");
    },
    // -------------------------------------------------------------------------
    async createNote() {
      writeLog("[BEGIN FUNCTION]: createNote");
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
      writeLog("[BEGIN FUNCTION]: handleKeyDown(event)");
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
      writeLog("[END FUNCTION]: handleKeyDown(event)");
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
      if (this.selectedNote.deleted === 1) {
        this.showNotification(this.$t("no_duplicate_deleted"), "red");
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

      this.noteTags = await NoteTagService.getNoteTags();
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
    async deleteNotePermanent(note) {
      writeLog("[BEGIN FUNCTION]: deleteNotePermanent(note)");
      let msgConfirm = this.$t("confirm_note_deleted_permanent", {
        note_name: note.name,
      });
      const confirmed = await confirm(msgConfirm);

      if (!confirmed) {
        writeLog("[END FUNCTION]: deleteNotePermanent(note)");
        return;
      }
      try {
        await NoteService.deleteNotePermanent(note);
        this.notes = await NoteService.getNotes();
        let msgDeleted = this.$t("note_deleted_permanent", {
          note_name: note.name,
        });
        this.showNotification(msgDeleted, "green");
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      writeLog("[END FUNCTION]: deleteNotePermanent(note)");
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
    async addTag(tagName) {
      writeLog("[BEGIN FUNCTION]: addTag(tagName)");

      try {
        // Étape 1 : Créer le nouveau tag. Cela renvoie l'ID du tag créé.
        await TagService.createTag(tagName);

        // Étape 2 : Récupérer le tag que vous venez de créer
        const tags = await TagService.getTags();
        this.tags = tags;

        const newTag = tags.find((tag) => tag.name === tagName);

        if (!newTag) {
          throw new Error("Tag not found after creation.");
        }

        // Étape 3 : Associer le tag à la note
        const tag = {
          tag_ID: newTag.tag_ID,
        };
        const note = {
          note_ID: this.selectedNote.note_ID,
        };
        await NoteTagService.createNoteTag(note, tag);
        this.noteTags = await NoteTagService.getNoteTags(note);
        this.notes = await NoteService.getNotes();
      } catch (error) {
        console.log(error);
        throw error;
      }
      writeLog("[END FUNCTION]: addTag(tagName)");
    },
    // -------------------------------------------------------------------------
    async deleteTag(tag) {
      writeLog("[BEGIN FUNCTION]: deleteTag(tag)");
      for (let i = 0; i < this.notes.length; i++) {
        let note = this.notes[i];
        await NoteTagService.deleteNoteTag(note, tag);
      }
      await TagService.deleteTag(tag);
      this.tags = await TagService.getTags();
      this.noteTags = await NoteTagService.getNoteTags();
      writeLog("[END FUNCTION]: deleteTag(tag)");
    },

    // -------------------------------------------------------------------------
    async deleteNoteTag(data) {
      writeLog("[BEGIN FUNCTION]: deleteNoteTag(tag)");
      let note = data[0];
      let tag = data[1];
      await NoteTagService.deleteNoteTag(note, tag);
      this.noteTags = await NoteTagService.getNoteTags();
      writeLog("[END FUNCTION]: deleteNoteTag(tag)");
    },
    // -------------------------------------------------------------------------
    async handleUpdateTagName(updatedTag) {
      writeLog("[BEGIN FUNCTION]: handleUpdateTagName(updatedTag)");
      await TagService.updateTag(updatedTag)
      this.tags = await TagService.getTags();
      this.noteTags = await NoteTagService.getNoteTags();
      writeLog("[END FUNCTION]: handleUpdateTagName(updatedTag)");
    },
    // -------------------------------------------------------------------------
    async setColorTag(tag, color) {
      writeLog("[BEGIN FUNCTION]: setColorTag(tag, color)");
      tag.color = color;
      await TagService.updateTag(tag);
      this.tags = await TagService.getTags();
      this.noteTags = await NoteTagService.getNoteTags();
      writeLog("[END FUNCTION]: setColorTag(tag, color)");
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

      // let data = {
      //   notes: this.notes,
      //   tags: this.noteTags,
      // };
      // let temp = [];

      // for (let i = 0; i < this.notes.length; i++) {
      //   let obj = {
      //     name: this.notes[i].name,
      //     content: this.notes[i].content,
      //     timestamp: this.notes[i].timestamp,
      //     isSaved: this.notes[i].isSaved,
      //     status_ID: this.notes[i].status_ID,
      //     pinned: this.notes[i].pinned,
      //     important: this.notes[i].important,
      //     selected: this.notes[i].selected,
      //     deleted: this.notes[i].deleted,
      //     tags: [],
      //   };
      //   for (let j = 0; j < this.noteTags.length; j++) {
      //     if (this.notes[i].note_ID === this.noteTags[j].note_ID) {
      //       let tag = {
      //         name: this.noteTags[j].name,
      //         color: this.noteTags[j].color,
      //       };
      //       obj.tags.push(tag);
      //     }
      //   }
      //   temp.push(obj);
      // }

      // console.log(temp);
      // if (data.notes.length === 0 && data.tags.length === 0) {
      //   this.showNotification(this.$t("no_data_to_export"), "red");
      //   writeLog("[END FUNCTION]: exportJSON()");
      //   return;
      // }

      // const json = JSON.stringify(temp);
      // try {
      //   const path = await save({
      //     filters: [{ name: "Fichiers texte", extensions: ["json"] }],
      //   });
      //   if (path) {
      //     await writeTextFile(path, json);
      //     this.showNotification(this.$t("data_exported"), "green");
      //   }
      // } catch (error) {
      //   this.showNotification(error, "red");
      //   console.log("DEBUG", error);
      // }
      writeLog("[END FUNCTION]: exportJSON()");
    },
    // -------------------------------------------------------------------------
    async importJSON() {
      writeLog("[BEGIN FUNCTION]: importJSON()");
      // const selectedFile = await open({
      //   multiple: false,
      //   filters: [{ name: "Fichiers texte", extensions: ["json"] }],
      // });
      // if (!selectedFile) {
      //   writeLog("[END FUNCTION]: importJSON()");
      //   return;
      // }

     // try {
        // const content = await readTextFile(selectedFile);
        // const noteItems = JSON.parse(content);

        // for (let i = 0; i < noteItems.length; i++) {
        //   let note = {
        //     name: noteItems[i].name,
        //     content: noteItems[i].content,
        //     timestamp: noteItems[i].timestamp,
        //     isSaved: noteItems[i].isSaved,
        //     status_ID: noteItems[i].status_ID,
        //     pinned: noteItems[i].pinned,
        //     important: noteItems[i].important,
        //     selected: 0,
        //     deleted: noteItems[i].deleted,
        //   };
        //   const createdNote = await NoteService.createNote(
        //     note.name,
        //     note.content,
        //     note.timestamp,
        //     note.isSaved,
        //     note.status_ID,
        //     note.pinned,
        //     note.important,
        //     note.selected,
        //     note.deleted,
        //   );
         // const noteID = createdNote.note_ID;
         // console.log(noteID)
          // for (let j = 0; j < noteItems[i].tags.length; j++) {
          //   let tag = {
          //     name: noteItems[i].tags[j].name,
          //     color: noteItems[i].tags[j].color,
          //   };
          //   const createdTag = await TagService.createTag(tag.name, tag.color);

          //   const tagID = createdTag.tag_ID;
          //   await NoteTagService.createNoteTag(noteID, tagID);
          // }
      //  }

     //   this.notes = await NoteService.getNotes();

        // let tagItems = [];
        // jsonParsed.tags.forEach((tag) => {
        //   tagItems.push(tag);
        // });
        // for (let i = 0; i < tagItems.length; i++) {
        //   await TagService.createTag(tagItems[i].name, tagItems[i].color);
        // }
      //  this.tags = await TagService.getTags();

        // for (let i = 0; i < this.notes.length; i++) {
        //   for (let j = 0; j < this.tags.length; j++) {
        //     if (this.notes[i].note_ID === this.tags[j].note_ID) {
        //       await NoteTagService.createNoteTag(this.notes[i], this.tags[j]);
        //     }
        //   }
        // }

      //  this.noteTags = await NoteTagService.getNoteTags();

        // this.showNotification(this.$t("data_imported"), "green");
      // } catch (error) {
      //   this.showNotification(error, "red");
      //   console.log("DEBUG", error);
      // }
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
}
.row {
  display: flex;
  height: 100%;
}
#column-left {
  min-width: 150px;
  max-width: 150px;
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
#column-img {
  flex-grow: 1;
  height: calc(100% - 66px);
  position: relative;
}

.img {
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
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

.app-btn.disabled,
.disabled {
  color: var(--text-color-button-disabled);
  cursor: not-allowed !important;
  user-select: none;
}
</style>
