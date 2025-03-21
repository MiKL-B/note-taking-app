<template>
  <div id="home-container">
    <Titlebar @close-app="closeApplication" />
    <Toolbar :distractionFree="selectedNote" @action-clicked="handleAction" @select-view="selectView"
      @display-about="displayAbout" />
    <div class="row">
      <div id="column-left" class="col-3" v-if="currentView !== 'distraction_free'">
        <Sidebar :tags="tags" :counters="getCountNotes" @delete-tag="deleteTag" @update-tag-name="handleUpdateTagName"
          @select-filter="handleFilter" />
      </div>
      <div id="column-middle" class="col-3" v-if="currentView !== 'distraction_free'">
        <div id="column-middle-header">
          <NoteFilter @sort-notes-AZ="toggleSortAZ" @sort-notes-date="toggleSortByDate"
            @sort-notes-clear="clearFilterSort" />
          <NoteSearch :modelValue="searchNote" @update:modelValue="$event => (searchNote = $event)" />
          <NoteCreator :canCreateNote="canCreateNote" @create-note="createNote" />
        </div>
        <Notelist :notes="filteredNotes" :selectedNote="selectedNote" @select-note="selectNote"
          @delete-note="deleteNote" @restore-note="restoreNote" @delete-note-permanent="deleteNotePermanent"
          @create-note="createNote" @duplicate-note="duplicateNote" @toggle-pin-note="togglePinNote"
          :isPinned="selectedNote.pinned" />
      </div>
      <div id="column-right" class="col-6" v-if="selectedNote">
        <Notebar :tags="tags" :showBoth="showBoth" @add-tag-note="addTag" @toggle-preview-mode="togglePreviewMode"
          @toggle-showboth="toggleShowBothTextareaPreview" @duplicate-note="duplicateNote"
          @update-status="changeNoteStatus" @toggle-pin-note="togglePinNote"
          @toggle-important-note="toggleImportantNote" :isPinned="selectedNote.pinned"
          :isImportant="selectedNote.important" v-model.modelValue="selectedNote.status_ID" @insert-item="insertItem" />
        <Note :isPreviewMode="isPreviewMode" :showBoth="showBoth" :selectedNote="selectedNote" :notes="notes"
          @delete-note-tag="deleteNoteTag" @mark-as-modified="markAsModified" />
      </div>
      <div id="column-img" v-else>
        <img class="img" src="/image-no-notes.png" />
      </div>
    </div>
  </div>
  <AppModal :message="modalMessage" :isModalConfirm="isModalConfirm" :isVisible="isModalVisible"
    @close="isModalVisible = false" @confirmed="handleConfirmed" @canceled="handleCanceled" />
  <AppNotification :message="notificationMessage" :color="notificationColor"
    :showNotification="isNotificationVisible" />
</template>

<script lang="ts">
// component
import Titlebar from "./components/Titlebar.vue";
import Toolbar from "./components/Toolbar.vue";
import Sidebar from "./components/Sidebar.vue";
import NoteFilter from "./components/NoteFilter.vue";
import NoteCreator from "./components/NoteCreator.vue";
import NoteSearch from "./components/NoteSearch.vue";
import Notelist from "./components/Notelist.vue";
import Notebar from "./components/Notebar.vue";
import Note from "./components/Note.vue";
import AppModal from "./components/AppModal.vue";
import AppNotification from "./components/AppNotification.vue";
// service
import initializeDatabase from "./service/database/index.js";
import NoteService from "./service/database/NoteService.js";
import TagService from "./service/database/TagService.js";
import { writeLog } from "./service/log/index.js";

// utils
import { sortArrayByName } from "./utils/sort.js";
// tauri api
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default {
  name: "App",
  components: {
    Titlebar,
    Toolbar,
    Sidebar,
    NoteFilter,
    NoteCreator,
    NoteSearch,
    Notelist,
    Notebar,
    Note,
    AppModal,
    AppNotification
  },
  data() {
    return {
      isPreviewMode: false,
      showBoth: false,
      notes: [],
      searchNote: "",
      tags: [],
      noteCounters: {},
      filter: "",
      sortedAsc: true,
      sortedDate: true,
      timerCreateNote: null,
      canCreateNote: true,
      currentView: "",
      noteCount: 0,
      jsonData: {},
      noteTags: [],
      tagsNoteTemp: [],
      // modal
      modalMessage: "",
      isModalConfirm: false,
      isModalVisible: false,
      modalResolvePromise: null,
      // notification
      notificationMessage: "",
      notificationColor: "",
      isNotificationVisible: false,
      notificationTimer: null
    };
  },
  async mounted() {
    initializeDatabase();
    this.notes = await NoteService.getNotes();
    this.tags = await TagService.getTags();
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
        case "":
        case "allnotes":
          return this.notes.filter((note) => {
            return (
              note.name.toLowerCase().includes(this.searchNote.toLowerCase()) &&
              note.deleted === 0
            );
          });
        default:
          return this.notes.filter((note) => {
            if (note.tags !== "") {
              let tags = JSON.parse(note.tags)
              for (let i = 0; i < tags.length; i++) {
                if (tags[i].name === this.filter) {
                  return note;
                }
              }
            }
          });
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
      this.currentView = newView;
    },
    // -------------------------------------------------------------------------
    insertItem(item: string) {
      writeLog(`[BEGIN FUNCTION]: insertItem(item: ${item})`);
      let activeLine = document.querySelector(".cm-content");
      let element = document.createElement("div");
      element.innerText = item;
      activeLine.appendChild(element)
      this.selectedNote.isSaved = 0;
      writeLog(`[END FUNCTION]: insertItem(item: ${item})`);
    },
    // -------------------------------------------------------------------------
    getToday() {
      return new Date().toLocaleString("fr-FR").split(" ")[0];
    },
    // -------------------------------------------------------------------------
    sortNotesByTimestamp() {
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
      sortArrayByName(this.notes);
      if (!this.sortedAsc) {
        this.notes.reverse();
      }
    },
    // -------------------------------------------------------------------------
    clearFilterSort() {
      this.sortedAsc = true;
      this.sortedDate = true;
      this.sortNotesByTimestamp();
    },
    // -------------------------------------------------------------------------
    toggleSortByDate() {
      this.sortedDate = !this.sortedDate;
      this.sortNotesByTimestamp();
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
          this.saveNote(this.selectedNote);
          break;
        case "exportpdf":
          this.exportASPDF();
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
          if (this.selectedNote.selected) {
            this.selectedNote.isSaved = 1;
            await NoteService.updateNote(this.selectedNote);
          }
          let note = {
            name: fileName,
            content: content,
            timestamp: Date.now(),
            isSaved: 1,
            status_ID: 1,
            pinned: 0,
            important: 0,
            selected: 0,
            deleted: 0,
          };

          let existingNoteDemo = this.notes.find(
            (note) => note.name === fileName,
          );
          if (existingNoteDemo) {
            this.showNotification(this.$t("note_already_exist"), "red");
            return;
          }

          await NoteService.createNote(note);
          this.notes = await NoteService.getNotes();
        })
        .catch((error) => {
          console.log(error);
          this.showNotification(error, "red");
        });
      writeLog("[END FUNCTION]: openNoteDemo()");
    },
    // -------------------------------------------------------------------------
    markAsModified() {
      writeLog("[BEGIN FUNCTION]: markAsModified(position)");
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
    async saveNote(note) {
      writeLog("[BEGIN FUNCTION]: saveNote(note)");
      if (this.selectedNote.isSaved === 1) {
        this.showNotification(
          this.$t("note_already_saved", { note_name: note.name }),
          "green",
        );
        return;
      }
      this.selectedNote.isSaved = 1;
      await NoteService.updateNote(note);
      this.showNotification(
        this.$t("note_saved", { note_name: note.name }),
        "green",
      );
      writeLog("[END FUNCTION]: saveNote(note)");
    },
    // -------------------------------------------------------------------------
    handleKeyDown(event) {
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
          this.saveNote(this.selectedNote);
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
      let msg = this.$t("confirm_close_app");
      const confirm = await this.openConfirm(msg, true)
      if (confirm) {
        writeLog("[END FUNCTION]: closeApplication()");
        appWindow.close();
      }
      else {
        writeLog("[END FUNCTION]: closeApplication()");
        return;
      }
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
      this.isNotificationVisible = true;
      this.notificationMessage = message;
      this.notificationColor = color;
      const duration = 4000;
      this.notificationTimer = setTimeout(() => {
        this.isNotificationVisible = false;
      }, duration);
    },
    // -------------------------------------------------------------------------
    async selectNote(note) {
      writeLog("[BEGIN FUNCTION]: selectNote(note)");
      if (this.selectedNote.selected) {
        this.selectedNote.isSaved = 1;
        await NoteService.updateNote(this.selectedNote);
      }

      await NoteService.unselectNotes();
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
      let msg = this.$t("confirm_note_deleted", {
        note_name: note.name,
      })
      const confirm = await this.openConfirm(msg, true);
      if (confirm) {
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
      }
      else {
        writeLog("[END FUNCTION]: deleteNote(note)");
        return;
      }

      writeLog("[END FUNCTION]: deleteNote(note)");
    },
    // -------------------------------------------------------------------------
    async restoreNote(note) {
      writeLog("[BEGIN FUNCTION]: restoreNote(note)");

      let msg = this.$t("confirm_note_restored", {
        note_name: note.name,
      });
      const confirm = await this.openConfirm(msg, true);
      if (confirm) {
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
      }
      else {
        writeLog("[END FUNCTION]: restoreNote(note)");
        return;
      }

      writeLog("[END FUNCTION]: restoreNote(note)");
    },
    // -------------------------------------------------------------------------
    async deleteNotePermanent(note) {
      writeLog("[BEGIN FUNCTION]: deleteNotePermanent(note)");

      let msg = this.$t("confirm_note_deleted_permanent", {
        note_name: note.name,
      });

      const confirm = await this.openConfirm(msg, true);
      if (confirm) {
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
      }
      else {
        writeLog("[END FUNCTION]: deleteNotePermanent(note)");
        return;
      }

      writeLog("[END FUNCTION]: deleteNotePermanent(note)");
    },
    // -------------------------------------------------------------------------
    async changeNoteStatus(newStatus) {
      writeLog("[BEGIN FUNCTION]: changeNoteStatus(newStatus)");
      this.selectedNote.status_ID = parseInt(newStatus);
      await NoteService.updateNote(this.selectedNote);
      writeLog("[END FUNCTION]: changeNoteStatus(newStatus)");
    },
    // -------------------------------------------------------------------------
    async addTag(tagName) {
      writeLog("[BEGIN FUNCTION]: addTag(tagName)");

      try {
        // add tag in tags
        const tagExistInTags = this.tags.find((tag) => tag.name === tagName);
        if (!tagExistInTags) {
          await TagService.createTag(tagName);
          this.tags = await TagService.getTags();
          this.showNotification(this.$t("tag_created", {
            tag_name: tagName,
          }), "green")
        }

        // add tag to selected note
        const newTag = this.tags.find((tag) => tag.name === tagName);

        if (!this.selectedNote.tags || this.selectedNote.tags === "") {
          this.selectedNote.tags = JSON.stringify([]);
        }

        let existingTags = JSON.parse(this.selectedNote.tags);
        let existingTag = existingTags.find((tag) => tag.name === newTag.name)
        if (!existingTag) {
          existingTags.push(newTag);
          this.showNotification(this.$t("tag_added_to_note", {
            tag_name: tagName,
          }), "green")
        }
        this.selectedNote.tags = JSON.stringify(existingTags);
        await NoteService.updateNote(this.selectedNote)
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
        if (this.notes[i].tags !== "") {
          let noteTags = JSON.parse(this.notes[i].tags)
          for (let j = 0; j < noteTags.length; j++) {
            if (noteTags[j].name === tag.name) {
              noteTags.splice(j, 1);
              break;
            }
          }
          this.notes[i].tags = JSON.stringify(noteTags);
          await NoteService.updateNote(this.notes[i])
        }
      }
      this.notes = await NoteService.getNotes();
      await TagService.deleteTag(tag);
      this.tags = await TagService.getTags();
      writeLog("[END FUNCTION]: deleteTag(tag)");
    },

    // -------------------------------------------------------------------------
    async deleteNoteTag(tag) {
      writeLog("[BEGIN FUNCTION]: deleteNoteTag(tag)");
      if (this.selectedNote.tags !== "") {
        let noteTags = JSON.parse(this.selectedNote.tags);
        for (let i = 0; i < noteTags.length; i++) {
          if (tag.name === noteTags[i].name) {
            noteTags.splice(i, 1);
            break;
          }
        }
        this.selectedNote.tags = JSON.stringify(noteTags);
        await NoteService.updateNote(this.selectedNote);
        this.notes = await NoteService.getNotes();
      }

      writeLog("[END FUNCTION]: deleteNoteTag(tag)");
    },
    // -------------------------------------------------------------------------
    async handleUpdateTagName(updatedTag) {
      writeLog("[BEGIN FUNCTION]: handleUpdateTagName(updatedTag)");
      for (let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].tags !== "") {
          let noteTags = JSON.parse(this.notes[i].tags)
          for (let j = 0; j < noteTags.length; j++) {
            noteTags[j].name = updatedTag.name;
          }
          this.notes[i].tags = JSON.stringify(noteTags);
          await NoteService.updateNote(this.notes[i])
        }
      }
      this.notes = await NoteService.getNotes();
      await TagService.updateTag(updatedTag);
      this.tags = await TagService.getTags();
      writeLog("[END FUNCTION]: handleUpdateTagName(updatedTag)");
    },
    // -------------------------------------------------------------------------
    async setColorTag(tag, color: string) {
      writeLog("[BEGIN FUNCTION]: setColorTag(tag, color)");
      for (let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].tags !== "") {
          let noteTags = JSON.parse(this.notes[i].tags)
          for (let j = 0; j < noteTags.length; j++) {
            if (noteTags[j].name === tag.name) {
              noteTags[j].color = color;
            }
          }
          this.notes[i].tags = JSON.stringify(noteTags);
          await NoteService.updateNote(this.notes[i])
        }
      }
      this.notes = await NoteService.getNotes();
      tag.color = color;
      await TagService.updateTag(tag);
      this.tags = await TagService.getTags();
      writeLog("[END FUNCTION]: setColorTag(tag, color)");
    },
    // -------------------------------------------------------------------------
    exportASPDF() {
      writeLog("[BEGIN FUNCTION]: exportASPDF()");
      writeLog("[END FUNCTION]: exportASPDF()");
    },
    // -------------------------------------------------------------------------
    async exportJSON() {
      writeLog("[BEGIN FUNCTION]: exportJSON()");

      let data = {
        notes: this.notes,
        tags: this.tags,
      };
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
        const data = JSON.parse(content);
        for (let i = 0; i < data.tags.length; i++) {
          let name = data.tags[i].name;
          await TagService.createTag(name)
        }
        this.tags = await TagService.getTags();

        for (let i = 0; i < data.notes.length; i++) {
          await NoteService.createNote(data.notes[i])
        }
        this.notes = await NoteService.getNotes();
      } catch (error) {
        this.showNotification(error, "red");
      }
      writeLog("[END FUNCTION]: importJSON()");
    },
    // -------------------------------------------------------------------------
    async displayAbout() {
      let msg = `Thoth 0.1.0\r\n${this.$t("developed")} Becquer Michaël`;
      await this.openConfirm(msg, false);
    },
    // -------------------------------------------------------------------------
    openConfirm(message: string, isModalConfirm: boolean) {
      this.modalMessage = message;
      this.isModalConfirm = isModalConfirm;

      return new Promise((resolve) => {
        this.modalResolvePromise = resolve;
        this.isModalVisible = true;
      });
    },
    // -------------------------------------------------------------------------
    handleConfirmed() {
      this.isModalVisible = false;
      this.modalResolvePromise(true);
    },
    // -------------------------------------------------------------------------
    handleCanceled() {
      this.isModalVisible = false;
      this.modalResolvePromise(false);
    }
    // -------------------------------------------------------------------------
  },
  beforeDestroy() {
    window.addEventListener("keydown", this.handleKeyDown);
    clearTimeout(this.notificationTimer);
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

#column-middle-header {
  border-bottom: var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  padding: 0.2rem;
  gap: 0.2rem;
  width: 100%;
}

#column-middle-header input {
  width: 160px;
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
