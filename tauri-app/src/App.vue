<template>
  <div id="home-container">
    <Titlebar @close-app="closeApplication" />
    <Toolbar @action-clicked="handleAction" @select-view="selectView" :distractionFree="selectedNote" />
    <div class="row">
      <div id="column-left" class="col-3" v-if="currentView !== 'distraction_free'">
        <Sidebar :tags="tags" :counters="getCountNotes" @delete-tag="deleteTag" @update-tag-name="handleUpdateTagName"
          @select-filter="handleFilter" @set-color="setColorTag" />
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
          @delete-note-tag="deleteNoteTag" @mark-as-modified="markAsModified" @get-position-cursor="getCursor" />
      </div>
      <div id="column-img" v-else>
        <img class="img" src="/image-no-notes.png" />
      </div>
    </div>
  </div>
  <div id="myModal" class="modal">
    <div class="modal-content">
      <p>{{ modalMessage }}</p>
      <div class="modal-footer">
        <button class="success" id="confirm">Yes</button>
        <button class="danger" id="cancel">No</button>
      </div>
    </div>

  </div>
  <Notification :message="messageNotification" :color="colorNotification" :showNotification="isVisibleNotification" />
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
import Notification from "./components/Notification.vue";

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
      modalMessage: ""
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
        default:
          return this.notes.filter((note) => {
            return (
              note.name.toLowerCase().includes(this.searchNote.toLowerCase()) &&
              note.deleted === 0
            );
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
    getCursor(position) {
      this.currentPosition = position;
    },
    // -------------------------------------------------------------------------
    insertItem(item: string) {
      writeLog(`[BEGIN FUNCTION]: insertItem(item: ${item})`);
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
      this.modalMessage = this.$t("confirm_note_deleted", {
        note_name: note.name,
      })
      this.openModal().then(async (result) => {
        if (result) {
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
      })

      writeLog("[END FUNCTION]: deleteNote(note)");
    },
    // -------------------------------------------------------------------------
    async restoreNote(note) {
      writeLog("[BEGIN FUNCTION]: restoreNote(note)");

      this.modalMessage = this.$t("confirm_note_restored", {
        note_name: note.name,
      });

      this.openModal().then(async (result) => {
        if (result) {
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
      })

      writeLog("[END FUNCTION]: restoreNote(note)");
    },
    // -------------------------------------------------------------------------
    async deleteNotePermanent(note) {
      writeLog("[BEGIN FUNCTION]: deleteNotePermanent(note)");

      this.modalMessage = this.$t("confirm_note_deleted_permanent", {
        note_name: note.name,
      });
      this.openModal().then(async (result) => {
        if (result) {
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
      })

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
        let noteTags = JSON.parse(this.notes[i].tags);
        for (let j = 0; j < noteTags.length; j++) {
          if (noteTags[j].name === tag.name) {
            noteTags.splice(j, 1);
            break;
          }
        }
        this.notes[i].tags = JSON.stringify(noteTags);
        await NoteService.updateNote(this.notes[i])
      }
      this.notes = await NoteService.getNotes();
      await TagService.deleteTag(tag);
      this.tags = await TagService.getTags();
      writeLog("[END FUNCTION]: deleteTag(tag)");
    },

    // -------------------------------------------------------------------------
    async deleteNoteTag(tag) {
      writeLog("[BEGIN FUNCTION]: deleteNoteTag(tag)");
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
      writeLog("[END FUNCTION]: deleteNoteTag(tag)");
    },
    // -------------------------------------------------------------------------
    async handleUpdateTagName(updatedTag) {
      writeLog("[BEGIN FUNCTION]: handleUpdateTagName(updatedTag)");
      for (let i = 0; i < this.notes.length; i++) {
        let noteTags = JSON.parse(this.notes[i].tags)
        for (let j = 0; j < noteTags.length; j++) {
          noteTags[j].name = updatedTag.name
        }
        this.notes[i].tags = JSON.stringify(noteTags);
        await NoteService.updateNote(this.notes[i])
      }
      this.notes = await NoteService.getNotes();
      await TagService.updateTag(updatedTag);
      this.tags = await TagService.getTags();
      writeLog("[END FUNCTION]: handleUpdateTagName(updatedTag)");
    },
    // -------------------------------------------------------------------------
    async setColorTag(tag, color) {
      writeLog("[BEGIN FUNCTION]: setColorTag(tag, color)");
      for (let i = 0; i < this.notes.length; i++) {
        let noteTags = JSON.parse(this.notes[i].tags)
        for (let j = 0; j < noteTags.length; j++) {
          if (noteTags[j].name === tag.name) {
            noteTags[j].color = color;
          }
        }
        this.notes[i].tags = JSON.stringify(noteTags);
        await NoteService.updateNote(this.notes[i])
      }
      this.notes = await NoteService.getNotes();
      tag.color = color;
      await TagService.updateTag(tag);
      this.tags = await TagService.getTags();
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
        const data = JSON.parse(content);
        console.log("import", data);
        for (let i = 0; i < data.tags.length; i++) {
          let name = data.tags[i].name;
          let color = data.tags[i].color;
          await TagService.createTag(name, color)
        }
        this.tags = await TagService.getTags();

        for (let i = 0; i < data.notes.length; i++) {
          await NoteService.createNote(data.notes[i])
        }
        this.notes = await NoteService.getNotes();
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      writeLog("[END FUNCTION]: importJSON()");
    },
    // -------------------------------------------------------------------------
    openModal() {
      return new Promise((resolve, reject) => {
        const modal = document.getElementById('myModal');
        modal.style.display = 'flex';
        document.getElementById('confirm').onclick = function () {
          modal.style.display = 'none';
          resolve(true); 
        };

        document.getElementById('cancel').onclick = function () {
          modal.style.display = 'none';
          resolve(false);
        };
      });
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

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.2);
}

.modal-content {
  background-color: var(--bg-body);
  color: var(--text-color-button);
  border: var(--border);
  border-radius: 5px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  gap: 0.2rem;
  justify-content: flex-end;
}
</style>
