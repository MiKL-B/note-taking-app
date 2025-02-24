<template>
  <div id="home-container">
    <Titlebar @close-app="closeApplication" />
    <Toolbar
      @action-clicked="handleAction"
      @select-view="selectView"
      :distractionFree="selectedNote"
    />
    <ViewKanban v-if="currentView === 'kanban'" />

    <div v-else class="row">
      <div
        id="column-left"
        class="col-3"
        v-if="currentView !== 'distraction_free'"
      >
        <Sidebar
          :tags="tags"
          :tree="tree"
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
          :isPinned="selectedNote.pinned"
          @toggle-important-note="toggleImportantNote"
          :isImportant="selectedNote.important"
          v-model.modelValue="selectedNote.status"
          @insert-item="insertItem"
        />
        <Note
          :isPreviewMode="isPreviewMode"
          :showBoth="showBoth"
          :selectedNote="selectedNote"
          :notes="notes"
          @delete-tag-note="deleteTagNote"
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
import { Plus, Eye, EyeOff, Tag, X, Columns2, CopyPlus } from "lucide-vue-next";

import DataNote from "../note.ts";
import getFilePath from "../FileManager.js";

import Titlebar from "../components/Titlebar.vue";
import Toolbar from "../components/Toolbar.vue";
import Sidebar from "../components/Sidebar.vue";
import NoteFilter from "../components/NoteFilter.vue";
import Notelist from "../components/Notelist.vue";
import Notebar from "../components/Notebar.vue";
import Note from "../components/Note.vue";
import Notification from "../components/Notification.vue";
import ViewKanban from "../components/ViewKanban.vue";

import { open, save } from "@tauri-apps/plugin-dialog";
import {
  readTextFile,
  writeTextFile,
  readDir,
  BaseDirectory,
  exists,
  remove,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { join, desktopDir } from "@tauri-apps/api/path";


const appWindow = getCurrentWindow();
export default {
  name: "Home",
  components: {
    Titlebar,
    Toolbar,
    Sidebar,
    NoteFilter,
    Notelist,
    Notebar,
    Note,
    Notification,
    Plus,
    Eye,
    EyeOff,
    Tag,
    X,
    Columns2,
    CopyPlus,
    ViewKanban,
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
      tree: null,
      currentView: "",
    };
  },
  mounted() {
    console.log("BEGIN [MOUNTED]");
    window.addEventListener("keydown", this.handleKeyDown);
    this.createFolder();
    console.log("BEGIN [COMPUTED]");
  },
  computed: {
    selectedNote() {
      console.log("BEGIN [COMPUTED] selectedNote()");
      console.log("END [COMPUTED] selectedNote()");
      const selectedNote = this.notes.find((note: Note) => note.selected);
      return selectedNote ? selectedNote : "";
    },
    // -------------------------------------------------------------------------
    filteredNotes() {
      console.log("BEGIN [COMPUTED] filteredNotes()");
      console.log("END [COMPUTED] filteredNotes()");
      switch (this.filter) {
        case "todo":
          return this.notes.filter((note: Note) => note.status === "todo");
        case "inprogress":
          return this.notes.filter(
            (note: Note) => note.status === "inprogress",
          );
        case "finished":
          return this.notes.filter((note: Note) => note.status === "finished");
        case "archived":
          return this.notes.filter((note: Note) => note.status === "archived");
        case "":
        case "allnotes":
          return this.notes.filter((note: Note) => {
            return note.name
              .toLowerCase()
              .includes(this.searchNote.toLowerCase());
          });
        case "pinned":
          return this.notes.filter((note: Note) => note.pinned === true);
        case "today":
          return this.notes.filter(
            (note) => note.createdDate.split(" ")[0] === this.getToday(),
          );
        case "important":
          return this.notes.filter((note: Note) => note.important === true);
        default:
          return this.notes.filter((note: Note) => {
            return note.tags.some((tag) =>
              tag.name.toLowerCase().includes(this.filter.toLowerCase()),
            );
          });
      }
    },
    // -------------------------------------------------------------------------
    getCountNotes() {
      console.log("BEGIN [COMPUTED] getCountNotes()");
      console.log("END [COMPUTED] getCountNotes()");
      return {
        allNotes: this.notes.filter((note: Note) => {
          return note.name
            .toLowerCase()
            .includes(this.searchNote.toLowerCase());
        }).length,
        todo: this.notes.filter((note: Note) => note.status === "todo").length,
        inProgress: this.notes.filter(
          (note: Note) => note.status === "inprogress",
        ).length,
        finished: this.notes.filter((note: Note) => note.status === "finished")
          .length,
        archived: this.notes.filter((note: Note) => note.status === "archived")
          .length,
        pinned: this.notes.filter((note: Note) => note.pinned === true).length,
        today: this.notes.filter(
          (note) => note.createdDate.split(" ")[0] === this.getToday(),
        ).length,
        important: this.notes.filter((note: Note) => note.important === true)
          .length,
      };
    },
  },
  methods: {
    selectView(newView: string) {
      console.log("BEGIN [METHODS] selectView(newView: string)", newView);
      this.currentView = newView;
      console.log("END [METHODS] selectView(newView: string)", newView);
    },
    // -------------------------------------------------------------------------
    insertItem(item: string) {
      console.log("BEGIN [METHODS] insertItem(item: string)", item);
      this.selectedNote.content += item + "\r\n";
      console.log("END [METHODS] insertItem(item: string)", item);
    },
    // -------------------------------------------------------------------------
    getToday() {
      console.log("BEGIN [METHODS] getToday()");
      console.log("END [METHODS] getToday()");
      return new Date().toLocaleString("fr-FR").split(" ")[0];
    },
    // -------------------------------------------------------------------------
    getTimeToday() {
      console.log("BEGIN [METHODS] getTimeToday()");
      console.log("END [METHODS] getTimeToday()");
      return new Date().toLocaleString("fr-FR").split(" ")[1];
    },
    // -------------------------------------------------------------------------
    sortNotes() {
      console.log("BEGIN [METHODS] sortNotes()");
      console.log("END [METHODS] sortNotes()");
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
      console.log("BEGIN [METHODS] sortNotesDate()");
      console.log("END [METHODS] sortNotesDate()");
      this.notes.sort((a: Note, b: Note) => {
        if (this.sortedDate) {
          return a.timestamp - b.timestamp;
        } else {
          return b.timestamp - a.timestamp;
        }
      });
    },
    // -------------------------------------------------------------------------
    toggleSortAZ() {
      console.log("BEGIN [METHODS] toggleSortAZ()");
      this.sortedAsc = !this.sortedAsc;
      this.sortNotes();
      if (!this.sortedAsc) {
        this.notes.reverse();
      }
      console.log("END [METHODS] toggleSortAZ()");
    },
    // -------------------------------------------------------------------------
    clearFilterSort() {
      console.log("BEGIN [METHODS] clearFilterSort()");
      this.sortedAsc = true;
      this.sortedDate = true;
      this.sortNotesDate();
      console.log("END [METHODS] clearFilterSort()");
    },
    // -------------------------------------------------------------------------
    toggleSortByDate() {
      console.log("BEGIN [METHODS] toggleSortByDate()");
      this.sortedDate = !this.sortedDate;
      this.sortNotesDate();
      console.log("END [METHODS] toggleSortByDate()");
    },
    // -------------------------------------------------------------------------
    togglePreviewMode() {
      console.log("BEGIN [METHODS] togglePreviewMode()");
      this.isPreviewMode = !this.isPreviewMode;
      console.log("END [METHODS] togglePreviewMode()");
    },
    // -------------------------------------------------------------------------
    toggleShowBothTextareaPreview() {
      console.log("BEGIN [METHODS] toggleShowBothTextareaPreview()");
      this.showBoth = !this.showBoth;
      console.log("END [METHODS] toggleShowBothTextareaPreview()");
    },
    // -------------------------------------------------------------------------
    handleFilter(filter: string) {
      console.log("BEGIN [METHODS] handleFilter(filter: string)", filter);
      this.filter = filter;
      console.log("END [METHODS] handleFilter(filter: string)", filter);
    },
    // -------------------------------------------------------------------------
    handleAction(action: string) {
      console.log("BEGIN [METHODS] handleAction(action: string)", action);
      switch (action) {
        case "newnote":
          this.createNote();
          break;
        // case "newfolder":
        //   this.createFolder();
        //   break;
        case "opennote":
          this.openDocument();
          break;
        case "opennotedemo":
          this.openNoteDemo();
          break;
        case "openfolder":
          this.openFolder();
          break;
        case "save":
          this.saveFile(this.selectedNote);
          break;
        case "saveas":
          this.saveAsDocument();
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
      console.log("END [METHODS] handleAction(action: string)", action);
    },
    // -------------------------------------------------------------------------
    openNoteDemo() {
      console.log("BEGIN [METHODS] openNoteDemo()");
      const selectedFile = "/Thoth demo.txt";
      const fileName = selectedFile
        .replace(/^.*[\\\/]/, "")
        .replace(/\.[^/.]+$/, "");

      fetch(selectedFile)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération du fichier");
          }
          return response.text();
        })
        .then((content) => {
          let note = new DataNote(fileName);
          note.content = content;
          this.notes.push(note);
        })
        .catch((error) => {
          this.showNotification(error, "red");
        });
      console.log("END [METHODS] openNoteDemo()");
    },
    // -------------------------------------------------------------------------
    async createFolder() {
      console.log("BEGIN [METHODS] async createFolder()");
      let folderName = "vault";
      const filePath = { baseDir: BaseDirectory.Desktop };
      try {
        let existingFolder = await exists(folderName, filePath);
        if (existingFolder) {
          return;
        }
        await mkdir(folderName, filePath);
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }

      console.log("END [METHODS] async createFolder()");
    },
    // -------------------------------------------------------------------------
    async openFolder() {
      console.log("BEGIN [METHODS] async openFolder()");
      const path = await open({
        directory: true,
        multiple: false,
      });
      if (!path) {
        return;
      }
      try {
        this.tree = await this.readContentFolder(path);
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      console.log("END [METHODS] async openFolder()");
    },
    // -------------------------------------------------------------------------
    async readContentFolder(path: string) {
      console.log(
        "BEGIN [METHODS] async readContentFolder(path: string)",
        path,
      );
      let options: object = {
        recursive: true,
      };

      const entries = await readDir(path, options);
      let tree = {
        name: path.replace(/\\/g, "/").split("/").pop() || "root",
        path: path,
        isDirectory: true,
        children: [],
      };

      for (const entry of entries) {
        const filePath = await join(path, entry.name);
        let node = {
          name: entry.name,
          path: filePath,
          isDirectory: entry.isDirectory,
          children: [],
        };

        if (entry.isFile) {
          try {
            const fileContent = await readTextFile(filePath);
            let noteName = entry.name.substring(0, entry.name.lastIndexOf('.'));
            let note = new DataNote(noteName);
            note.content = fileContent;
            this.notes.push(note);
          } catch (error) {
            this.showNotification(error, "red");
          }
        } else if (entry.isDirectory) {
          let arr = await this.readContentFolder(filePath);
          node.children = arr.children;
        }
        tree.children.push(node);
      }
      console.log("END [METHODS] async readContentFolder(path: string)", path);
      return tree;
    },
    // -------------------------------------------------------------------------
    async openDocument() {
      console.log("BEGIN [METHODS] async openDocument()");
      const selectedFile = await open({
        multiple: false,
        filters: [{ name: "Fichiers texte", extensions: ["txt", "md"] }],
      });
      if (!selectedFile) {
        return;
      }
      const fileName = selectedFile
        .replace(/^.*[\\\/]/, "")
        .replace(/\.[^/.]+$/, "");
      try {
        const content = await readTextFile(selectedFile);

        let note = new DataNote(fileName);
        note.content = content;
        this.notes.push(note);
        this.showNotification(
          this.$t("note_created", { note_name: note.name }),
          "green",
        );
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      console.log("END [METHODS] async openDocument()");
    },
    // -------------------------------------------------------------------------
    async saveAsDocument() {
      console.log("BEGIN [METHODS] async saveAsDocument()");
      if (!this.selectedNote) {
        return;
      }
      try {
        const path = await save({
          filters: [{ name: "Fichiers texte", extensions: ["txt", "md"] }],
        });

        if (path) {
          const content = this.selectedNote.content;
          await writeTextFile(path, content);
        }
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      console.log("END [METHODS] async saveAsDocument()");
    },
    // -------------------------------------------------------------------------
    generateIncrementedName(baseTitle: string) {
      console.log("BEGIN [METHODS] generateIncrementedName(baseTitle:string)");
      if (!this.noteCounters[baseTitle]) {
        this.noteCounters[baseTitle] = 1;
      } else {
        this.noteCounters[baseTitle] += 1;
      }
      console.log("END [METHODS] generateIncrementedName(baseTitle:string)");
      return `${baseTitle} ${this.noteCounters[baseTitle]}`;
    },
    // -------------------------------------------------------------------------
    createNote() {
      console.log("BEGIN [METHODS] METHODS createNote()");
      let name = this.generateIncrementedName("Note");
      let note = new DataNote(name);
      this.notes.push(note);
      this.saveFile(note);
      this.setDelayCreationNote();
      console.log("END [METHODS] METHODS createNote()");
    },
    // -------------------------------------------------------------------------
    async saveFile(note: Note) {
      console.log("BEGIN [METHODS] saveFile(note:Note)", note);
      let file = {
        name: note.name + ".txt",
        content: note.content,
      };

      const filePath = await getFilePath(file.name);

      try {
        let existingFile = await exists(filePath);

        if (!existingFile) {
          await writeTextFile(filePath, file.content);
          this.showNotification(
            this.$t("note_created", { note_name: note.name }),
            "green",
          );
          console.log("file created");
          console.log("END [METHODS] saveFile(note:Note)", note);
        } else {
          note.updatedDate = new Date().toLocaleString("fr-FR");
          await readTextFile(filePath);
          await writeTextFile(filePath, file.content);
          this.showNotification(
            this.$t("note_saved", { note_name: note.name }),
            "green",
          );
          console.log("file updated");
          console.log("END [METHODS] saveFile(note:Note)", note);
        }
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
    },
    // -------------------------------------------------------------------------
    handleKeyDown(event) {
      console.log("BEGIN [METHODS] handleKeyDown(event)", event);

      // New note Ctrl + N
      if (event.ctrlKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        this.createNote();
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
        console.log("END [METHODS] handleKeyDown(event)", event);
        this.closeApplication();
      }

      console.log("END [METHODS] handleKeyDown(event)", event);
    },
    // -------------------------------------------------------------------------
    async closeApplication() {
      console.log("BEGIN [METHODS] closeApplication()");
      let msgConfirm = this.$t("confirm_close_app");
      const confirmed = await confirm(msgConfirm);

      if (!confirmed) {
        console.log("END [METHODS] closeApplication()");
        return;
      }
      appWindow.close();
      console.log("END [METHODS] closeApplication()");
    },
    // -------------------------------------------------------------------------
    setDelayCreationNote() {
      console.log("BEGIN [METHODS] setDelayCreationNote()");
      const duration = 500;
      this.canCreateNote = false;
      this.timerCreateNote = setTimeout(() => {
        this.canCreateNote = true;
      }, duration);
      console.log("END [METHODS] setDelayCreationNote()");
    },
    // -------------------------------------------------------------------------
    togglePinNote() {
      console.log("BEGIN [METHODS] togglePinNote()");
      this.selectedNote.pinned = !this.selectedNote.pinned;
      console.log("BEGIN [METHODS] togglePinNote()");
    },
    // -------------------------------------------------------------------------
    toggleImportantNote() {
      console.log("BEGIN [METHODS] toggleImportantNote()");
      this.selectedNote.important = !this.selectedNote.important;
      console.log("BEGIN [METHODS] toggleImportantNote()");
    },
    // -------------------------------------------------------------------------
    duplicateNote() {
      console.log("BEGIN [METHODS] duplicateNote()");
      if (!this.selectedNote) {
        console.log("END [METHODS] duplicateNote()");
        return;
      }
      let name = this.selectedNote.name + " - " + this.$t("copy");
      let status = this.selectedNote.status;
      let color = this.selectedNote.color;
      let content = this.selectedNote.content;
      let tags = [];
      this.selectedNote.tags.forEach((tag) => {
        let tagCopy = {
          id: tag.id,
          name: tag.name,
          color: tag.color,
          selected: false,
        };
        tags.push(tagCopy);
      });
      let note = new DataNote(name);
      note.status = status;
      note.color = color;
      note.content = content;
      note.tags = tags;

      this.notes.push(note);
      this.showNotification(
        this.$t("note_duplicated", {
          note_name: this.selectedNote.name,
        }),
        "green",
      );
      this.setDelayCreationNote();
      console.log("END [METHODS] duplicateNote()");
    },
    // -------------------------------------------------------------------------
    showNotification(message: string, color: string) {
      console.log(
        "BEGIN [METHODS] showNotification(message: string, color: string)",
        message,
        color,
      );
      this.isVisibleNotification = true;
      this.messageNotification = message;
      this.colorNotification = color;
      const duration = 4000;
      this.timerNotification = setTimeout(() => {
        this.isVisibleNotification = false;
      }, duration);
      console.log(
        "END [METHODS] showNotification(message: string, color: string)",
        message,
        color,
      );
    },
    // -------------------------------------------------------------------------
    selectNote(note: Note) {
      console.log("BEGIN [METHODS] selectNote(note: Note)", note);
      this.notes.forEach((n: Note) => {
        n.selected = false;
      });
      note.selected = true;
      console.log("END [METHODS] selectNote(note: Note)", note);
    },
    // -------------------------------------------------------------------------
    async deleteNote(note: Note) {
      console.log("BEGIN [METHODS] async deleteNote(note: Note)", note);
      let msgConfirm = this.$t("confirm_note_deleted", {
        note_name: note.name,
      });
      const confirmed = await confirm(msgConfirm);

      if (!confirmed) {
        return;
      }
      const index = this.notes.findIndex((n: Note) => n.id === note.id);

      if (index < 0) {
        console.log("END [METHODS] async deleteNote(note: Note)");
        return;
      }
      let file = {
        name:note.name + ".txt",
      }
      const filePath = await getFilePath(file.name);
      
      try {
        this.notes.splice(index, 1);
        await remove(filePath);
        let msgDeleted = this.$t("note_deleted", {
          note_name: note.name,
        });
        this.showNotification(msgDeleted, "green");
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      console.log("END [METHODS] async deleteNote(note: Note)", note);
    },
    // -------------------------------------------------------------------------
    changeNoteStatus(newStatus: string) {
      console.log(
        "BEGIN [METHODS] changeNoteStatus(newStatus: string)",
        newStatus,
      );
      this.selectedNote.status = newStatus;
      switch (this.selectedNote.status) {
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
      console.log(
        "END [METHODS] changeNoteStatus(newStatus: string)",
        newStatus,
      );
    },
    // -------------------------------------------------------------------------
    deleteTag(tag) {
      console.log("BEGIN [METHODS] deleteTag(tag)", tag);
      const index = this.tags.findIndex((t) => t.id === tag.id);

      if (index > -1) {
        for (let i = 0; i < this.notes.length; i++) {
          this.notes[i].tags = this.notes[i].tags.filter(
            (t) => t.id !== tag.id,
          );
        }

        this.tags.splice(index, 1);
        let msgDeleted = this.$t("tag_deleted", { tag_name: tag.name });
        this.showNotification(msgDeleted, "green");
      }
      console.log("END [METHODS] deleteTag(tag)", tag);
    },
    // -------------------------------------------------------------------------
    addTag(tag) {
      console.log("BEGIN [METHODS] addTag(tag)", tag);
      const word = tag.trim();
      const pattern = /^[a-zA-ZÀ-ÿ]+$/;
      let tagtoAdd = {
        id: Date.now(),
        name: word,
        color: "blue",
        selected: false,
      };

      const existingTag = this.tags.find(
        (t) => t.name.toLocaleString() === word.toLowerCase(),
      );
      const existingTagNote = this.selectedNote.tags.find(
        (t) => t.name.toLowerCase() === word.toLowerCase(),
      );
      if (!pattern.test(word)) {
        return;
      }
      if (!existingTag) {
        this.tags.push(tagtoAdd);
        this.selectedNote.tags.push(tagtoAdd);
        let msgCreated = this.$t("tag_created", {
          tag_name: tagtoAdd.name,
        });
        this.showNotification(msgCreated, "green");
        console.log("END [METHODS] addTag(tag)", tag);
        return;
      }
      tagtoAdd.color = existingTag.color;
      tagtoAdd.id = existingTag.id;
      if (!existingTagNote) {
        this.selectedNote.tags.push(tagtoAdd);
        console.log("END [METHODS] addTag(tag)", tag);
        return;
      }
      console.log("END [METHODS] addTag(tag)", tag);
    },
    // -------------------------------------------------------------------------
    deleteTagNote(tag) {
      console.log("BEGIN [METHODS] deleteTagNote(tag)", tag);
      const index = this.selectedNote.tags.findIndex((t) => t.id === tag.id);
      if (index > -1) {
        this.selectedNote.tags.splice(index, 1);
      }
      console.log("END [METHODS] deleteTagNote(tag)", tag);
    },
    // -------------------------------------------------------------------------
    handleUpdateTagName(updatedTag) {
      console.log(
        "BEGIN [METHODS] handleUpdateTagName(updatedTag)",
        updatedTag,
      );
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
      console.log("END [METHODS] handleUpdateTagName(updatedTag)", updatedTag);
    },
    // -------------------------------------------------------------------------
    setColorTag(tag, color) {
      console.log("BEGIN [METHODS] setColorTag(tag, color)", tag, color);
      const index = this.tags.findIndex((t) => t.id === tag.id);

      for (let i = 0; i < this.notes.length; i++) {
        for (let j = 0; j < this.notes[i].tags.length; j++) {
          if (this.notes[i].tags[j].id === tag.id) {
            this.notes[i].tags[j].color = color;
          }
        }
      }
      this.tags[index].color = color;
      console.log("END [METHODS] setColorTag(tag, color)", tag, color);
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
      console.log("BEGIN [METHODS] async exportJSON()");
      let data = {
        notes: this.notes,
        tags: this.tags,
      };
      if (data.notes.length === 0 && data.tags.length === 0) {
        this.showNotification(this.$t("no_data_to_export"), "red");
        console.log("END [METHODS] async exportJSON()");
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

      console.log("END [METHODS] async exportJSON()");
    },
    // -------------------------------------------------------------------------
    async importJSON() {
      console.log("BEGIN [METHODS] async importJSON()");
      const selectedFile = await open({
        multiple: false,
        filters: [{ name: "Fichiers texte", extensions: ["json"] }],
      });
      if (!selectedFile) {
        return;
      }

      try {
        const content = await readTextFile(selectedFile);
        const jsonParsed = JSON.parse(content);

        jsonParsed.notes.forEach((note) => {
          this.notes.push(note);
        });

        jsonParsed.tags.forEach((tag) => {
          this.tags.push(tag);
        });

        this.showNotification(this.$t("data_imported"), "green");
      } catch (error) {
        this.showNotification(error, "red");
        console.log("DEBUG", error);
      }
      console.log("END [METHODS] async importJSON()");
    },
  },
  beforeDestroy() {
    console.log("BEGIN [BEFOREDESTROY]");
    window.addEventListener("keydown", this.handleKeyDown);
    clearTimeout(this.timerNotification);
    clearTimeout(this.timerCreateNote);
    console.log("END [BEFOREDESTROY]");
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
  max-width: 200px;
}
#column-middle {
  max-width: 263.5px;
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
