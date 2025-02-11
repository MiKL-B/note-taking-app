<template>
  <Titlebar />
  <Toolbar
    @action-clicked="handleAction"
    @display-about="displayAbout"
    @open-window="openWindow"
    @toggle-sidebar="toggleSidebar"
    @toggle-notelist="toggleNoteList"
  />

  <div id="container">
    <div class="row">
      <!-- left column -->
      <div class="col-3" style="max-width: 200px" v-if="isVisibleSidebar">
        <!-- sidebar -->
        <Sidebar
          :tags="tags"
          :countAllNotes="notes.length"
          :countTodo="getCountTodo"
          :countInProgress="getCountInProgress"
          :countFinished="getCountFinished"
          :countArchived="getCountArchived"
          :countPinned="getCountPinned"
          :countToday="getCountToday"
          :countImportant="getCountImportant"
          @delete-tag="deleteTag"
          @update-tag-name="handleUpdateTagName"
          @select-filter="handleFilter"
          @set-color="setColorTag"
        />
      </div>
      <!-- middle column -->
      <div class="col-3 column-notelist" v-if="isVisibleNotelist">
        <!-- filternote -->
        <FilterNote
          :canCreateNote="canCreateNote"
          v-model="searchNote"
          @create-note="createNote"
          @sort-notes-AZ="toggleSortAZ"
          @sort-notes-date="toggleSortByDate"
          @sort-notes-clear="clearFilterSort"
        />
        <!-- notelist -->
        <Notelist
          :notes="filteredNotes"
          @select-note="selectNote"
          @delete-note="deleteNote"
        />
      </div>
      <!-- right column -->
      <div class="col-6" style="flex-grow: 1" v-if="selectedNote">
        <!-- notebar -->
        <Notebar
          :tags="tags"
          :showBoth="showBoth"
          @add-tag-note="addTag"
          @toggle-preview-mode="toggleMarkdown"
          @toggle-showboth="toggleShowBothTextareaPreview"
          @duplicate-note="duplicateNote"
          @update-status="changeNoteStatus"
          @toggle-pin-note="togglePinNote"
          :isPinned="selectedNote.pinned"
          @toggle-important-note="toggleImportantNote"
          :isImportant="selectedNote.important"
          v-model.modelValue="selectedNote.status"
        />
        <div class="column-note-content" :style="{ height: noteHeight }">
          <div id="column-note-title">
            <div
              style="margin: auto 0"
              class="color-circle"
              :class="`bg-${selectedNote.color}`"
            ></div>
            <input
              id="input-note-name"
              type="text"
              v-model="selectedNote.name"
              :placeholder="$t('note_name_here')"
            />
          </div>
          <div class="note-tag-list">
            <span
              class="tag"
              v-for="tag in selectedNote.tags"
              :style="` background: var(--${tag.color} `"
              >{{ tag.name }}
              <span class="delete-tag-btn" @click="deleteTagNote(tag)"
                ><X class="size-16" />
              </span>
            </span>
          </div>
          <div id="bothColumns" v-if="showBoth">
            <div>
              <textarea
                :placeholder="$t('enter_text_here')"
                v-model="selectedNote.content"
                ref="div1"
                @scroll="syncScroll('div1')"
                spellcheck="false"
              ></textarea>
            </div>
            <hr class="separator-column" />
            <div
              id="markdown-container"
              v-html="getMarkdownHtml()"
              ref="div2"
              @scroll="syncScroll('div2')"
            ></div>
          </div>
          <div id="oneView" v-else>
            <div v-if="!isPreviewMode">
              <textarea
                :placeholder="$t('enter_text_here')"
                v-model="selectedNote.content"
                spellcheck="false"
              ></textarea>
            </div>
            <div
              v-else
              id="markdown-container"
              v-html="getMarkdownHtml()"
            ></div>
          </div>
        </div>
      </div>

      <div class="column-note img" v-else>
        <img src="/image3-removebg-preview.png" />
      </div>
    </div>
  </div>

  <Notification
    :message="messageNotification"
    :color="colorNotification"
    :showNotification="isVisibleNotification"
  />
  <!-- <Statusbar :noteLength="getContentNoteLength" /> -->
</template>

<script>
import Titlebar from "../components/Titlebar.vue";
import Toolbar from "../components/Toolbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Notelist from "../components/Notelist.vue";
import Notebar from "../components/Notebar.vue";
// import Statusbar from "../components/Statusbar.vue";
import Notification from "../components/Notification.vue";
import FilterNote from "../components/FilterNote.vue";
import { Plus, Eye, EyeOff, Tag, X, Columns2, CopyPlus } from "lucide-vue-next";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { marked } from "marked";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
const appWindow = getCurrentWindow();
export default {
  name: "Home",
  components: {
    Titlebar,
    Toolbar,
    Sidebar,
    Notelist,
    Notebar,
    Notification,
    FilterNote,
    Plus,
    Eye,
    EyeOff,
    Tag,
    X,
    Columns2,
    CopyPlus,
  },
  data() {
    return {
      isVisibleNoteBar: true,
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
      isVisibleSidebar: true,
      isVisibleNotelist:true,
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
        case "pinned":
          return this.notes.filter((note) => note.pinned === true);
        case "today":
          return this.notes.filter(
            (note) => note.date.split(" ")[0] === this.getToday()
          );
        case "important":
          return this.notes.filter((note) => note.important === true);
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
    getCountPinned() {
      return this.notes.filter((note) => note.pinned === true).length;
    },
    getCountToday() {
      return this.notes.filter(
        (note) => note.date.split(" ")[0] === this.getToday()
      ).length;
    },
    getCountImportant() {
      return this.notes.filter((note) => note.important === true).length;
    },
  },
  methods: {
    getToday() {
      return new Date().toLocaleString("fr-FR").split(" ")[0];
    },
    sortNotes() {
      this.notes.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (b.name < a.name) {
          return 1;
        }
        return 0;
      });
    },
    sortNotesDate(ascending) {
      this.notes.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (ascending) {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    },
    toggleSortAZ() {
      this.sortedAsc = !this.sortedAsc;
      this.sortNotes();
      if (!this.sortedAsc) {
        this.notes.reverse();
      }
    },
    clearFilterSort() {
      this.sortedAsc = true;
      this.sortedDate = true;
      this.sortNotesDate(true);
    },
    toggleSortByDate() {
      this.sortedDate = !this.sortedDate;
      this.sortNotesDate(this.sortedDate);
    },
    getMarkdownHtml() {
      return marked(this.selectedNoteContent, { sanitize: true });
    },
    toggleMarkdown() {
      this.isPreviewMode = !this.isPreviewMode;
    },
    toggleShowBothTextareaPreview() {
      this.showBoth = !this.showBoth;
    },
    handleFilter(filter) {
      this.filter = filter;
    },
    handleAction(action) {
      switch (action) {
        case "new":
          this.createNote();
          break;
        case "open":
          this.openDocument();
          break;
        case "save":
          this.saveDocument();
          break;
        case "exportjson":
          this.exportJSON();
          break;
        case "importjson":
          this.importJSON();
          break;
        case "exit":
          appWindow.close();
          break;
        default:
          alert(`Unknown action: ${action}`);
          break;
      }
    },
    toggleSidebar() {
      this.isVisibleSidebar = !this.isVisibleSidebar;
    },
    toggleNoteList(){
      this.isVisibleNotelist = !this.isVisibleNotelist;
    },
    async openDocument() {
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
      // let firstLine = content.split("\n")[0].trim();
      // let text = "";
      // if (
      //   firstLine === "todo" ||
      //   firstLine === "inprogress" ||
      //   firstLine === "finished" ||
      //   firstLine === "archived"
      // ) {
      //   text = content.split("\n")[1].trim();
      // }
      // text = content
      // console.log(firstLine);

      // let colorStatus = "";

      // switch (firstLine) {
      //   case "todo":
      //     colorStatus = "red";
      //     break;
      //   case "inprogress":
      //     colorStatus = "yellow";
      //     break;
      //   case "finished":
      //     colorStatus = "green";
      //     break;
      // }

      try {
        const content = await readTextFile(selectedFile);

        let newNote = {
          id: Date.now(),
          name: fileName,
          date: new Date().toLocaleString("fr-FR"),
          status: "todo",
          color: "red",
          content: content,
          tags: [],
          selected: false,
        };

        this.notes.push(newNote);
        this.showNotification(
          this.$t("note_created", { note_name: newNote.name }),
          "green"
        );
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier : ", error);
      }
    },

    async saveDocument() {
      if (!this.selectedNote) {
        return;
      }

      const path = await save({
        filters: [{ name: "Fichiers texte", extensions: ["txt", "md"] }],
      });

      if (path) {
        const content = this.selectedNote.content;
        await writeTextFile(path, content);
      }
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
        name: this.generateIncrementedName("Note"),
        date: new Date().toLocaleString("fr-FR"),
        status: "todo",
        color: "red",
        content: "",
        tags: [],
        selected: false,
        pinned: false,
        important: false,
      };
      this.notes.push(newNote);
      this.showNotification(
        this.$t("note_created", { note_name: newNote.name }),
        "green"
      );
      this.setDelayCreationNote();
    },
    setDelayCreationNote() {
      const duration = 500;
      this.canCreateNote = false;
      this.timerCreateNote = setTimeout(() => {
        this.canCreateNote = true;
      }, duration);
    },
    togglePinNote() {
      this.selectedNote.pinned = !this.selectedNote.pinned;
    },
    toggleImportantNote() {
      this.selectedNote.important = !this.selectedNote.important;
    },
    duplicateNote() {
      if (!this.selectedNote) {
        return;
      }
      let copyNote = {
        id: Date.now(),
        name: this.selectedNote.name + " - " + this.$t("copy"),
        date: new Date().toLocaleString("fr-FR"),
        status: this.selectedNote.status,
        color: this.selectedNote.color,
        content: this.selectedNote.content,
        tags: [],
        selected: false,
        pinned: false,
        important: false,
      };
      this.notes.push(copyNote);
      this.showNotification(
        this.$t("note_duplicated", { note_name: this.selectedNote.name }),
        "green"
      );
      this.setDelayCreationNote();
    },
    showNotification(message, color) {
      this.isVisibleNotification = true;
      this.messageNotification = message;
      this.colorNotification = color;
      const duration = 2000;
      this.timerNotification = setTimeout(() => {
        this.isVisibleNotification = false;
      }, duration);
    },
    selectNote(note) {
      this.notes.forEach((n) => {
        n.selected = false;
      });
      note.selected = true;
    },
    async deleteNote(note) {
      const confirmed = await confirm(
        `Are you sure you want to delete ${note.name}?`
      );

      if (!confirmed) {
        return;
      }
      const index = this.notes.findIndex((n) => n.id === note.id);

      if (index > -1) {
        this.notes.splice(index, 1);
        this.showNotification(
          this.$t("note_deleted", { note_name: note.name }),
          "green"
        );
      }
    },
    changeNoteStatus(newStatus) {
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
        this.showNotification(
          this.$t("tag_deleted", { tag_name: tag.name }),
          "green"
        );
      }
    },
    addTag(tag) {
      const word = tag.trim();
      const pattern = /^[a-zA-ZÀ-ÿ]+$/;
      let tagtoAdd = {
        id: Date.now(),
        name: word,
        color: "blue",
        selected: false,
      };

      const existingTag = this.tags.find(
        (t) => t.name.toLocaleString() === word.toLowerCase()
      );
      const existingTagNote = this.selectedNote.tags.find(
        (t) => t.name.toLowerCase() === word.toLowerCase()
      );
      if (!pattern.test(word)) {
        return;
      }
      if (!existingTag) {
        this.tags.push(tagtoAdd);
        this.selectedNote.tags.push(tagtoAdd);
        this.showNotification(
          this.$t("tag_created", { tag_name: tagtoAdd.name }),
          "green"
        );
        return;
      }
      tagtoAdd.color = existingTag.color;
      tagtoAdd.id = existingTag.id;
      if (!existingTagNote) {
        this.selectedNote.tags.push(tagtoAdd);
        return;
      }
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

      for (let i = 0; i < this.notes.length; i++) {
        for (let j = 0; j < this.notes[i].tags.length; j++) {
          if (this.notes[i].tags[j].id === tag.id) {
            this.notes[i].tags[j].color = color;
          }
        }
      }
      this.tags[index].color = color;
    },
    // markdown
    getMarkdownHtml() {
      return marked(this.selectedNote.content, { sanitize: true });
    },
    // exportASPDF
    exportASPDF() {
      let name = this.selectedNote.name || "Untitled";
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
    async exportJSON() {
      let data = {
        notes: this.notes,
        tags: this.tags,
      };
      if (data.notes.length === 0 && data.tags.length === 0) {
        this.showNotification(this.$t("no_data_to_export"), "red");
        return;
      }
      const json = JSON.stringify(data);
      const path = await save({
        filters: [{ name: "Fichiers texte", extensions: ["json"] }],
      });
      if (path) {
        await writeTextFile(path, json);
        this.showNotification(this.$t("data_exported"), "green");
      }
    },
    async importJSON() {
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
        console.error(error);
      }
    },
    syncScroll(source) {
      const div1 = this.$refs.div1;
      const div2 = this.$refs.div2;

      if (source === "div1") {
        div2.scrollTop = div1.scrollTop;
      } else {
        div1.scrollTop = div2.scrollTop;
      }
    },
    displayAbout() {
      let msg = this.$t("developed");
      alert(msg + " Becquer Michaël.");
    },
    openWindow() {
      const webview = new WebviewWindow("settings_window", {
        url: "./settings-window",
        decorations: false,
        title: "Settings",
        resizable: false,
        alwaysOnTop: true,
        center: true,
        width: 600,
        height: 400,
      });
      webview.once("tauri://created", function () {
        document.body.style.pointerEvents = "none";
        document.body.style.userSelect = "none";
        document.body.style.opacity = "0.5";
      });

      webview.once("tauri://close-requested", function () {
        webview.close();
      });
      webview.once("tauri://destroyed", function () {
        document.body.style.pointerEvents = "auto";
        document.body.style.userSelect = "auto";
        document.body.style.opacity = "1";
      });

      webview.once("tauri://error", function (e) {
        console.error("Erreur lors de la création du webview :", e);
      });
    },
  },
  beforeDestroy() {
    clearTimeout(this.timerNotification);
    clearTimeout(this.timerCreateNote);
  },
};
</script>
<style>
.row {
  display: flex;
}

.column-notelist {
  border-right: var(--border);
  max-width: 265px;
  background: var(--bg-notelist);
  color: var(--text-color-notelist);
}

.column-note-content {
  background: var(--bg-note);
  color: var(--text-color-note);
}
.col-3 {
  width: 25%;
}

.col-6 {
  width: 50%;
}
#column-note-title {
  display: flex;
  padding: 0 0.2rem;
  width: 100%;
}
#input-note-name {
  width: 100%;
  border: none;
  box-shadow: none;
  font-size: 20px;
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

.delete-tag-btn {
  cursor: pointer;
  color: var(--dark2);
}
.note-tag-list {
  flex-wrap: wrap;
  overflow-y: scroll;
  max-height: 26px;
  height: 26px;
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
.img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin:auto;
  user-select: none;
}
img {
  width: 100%;
}
#bothColumns {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: calc(100vh - 170px);
}
.separator-column {
  border-left: none;
  border-right: 1px solid var(--grey);
  height: 100%;
  margin: 0 1rem;
}
#oneView {
  height: calc(100vh - 170px);
}
#oneView div {
  height: 100%;
}
#bothColumns div {
  height: 100%;
}
.app-btn.disabled,
.disabled {
  color: var(--text-color-button-disabled);
  cursor: not-allowed;
  user-select: none;
}
</style>
