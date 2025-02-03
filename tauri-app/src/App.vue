<template>
  <Titlebar />
  <Toolbar
    :isNoteSelected="selectedNote"
    @action-clicked="handleAction"
    @toggle-menu="toggleMenu"
    @toggle-notelist="toggleNoteList"
    @toggle-notebar="toggleNoteBar"
    @toggle-markdownmode="toggleMarkdownMode"
  />
  <div id="container">
    <div
      class="column-sidebar"
      :style="{ flex: isVisibleNoteList ? '1' : '2' }"
      :class="{ invisible: !isVisibleMenu }"
    >
      <Sidebar
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
    <div class="column-notelist" :class="{ invisible: !isVisibleNoteList }">
      <div id="filter-note">
        <input
          type="text"
          v-model="searchNote"
          :placeholder="$t('filter_note_by_name')"
        />
        <button @click="createNote"><Plus /></button>
      </div>
      <Notelist
        :notes="filteredNotes"
        @select-note="selectNote"
        @delete-note="deleteNote"
      />
    </div>
    <div
      class="column-note"
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
              :placeholder="$t('note_name_here')"
            />
          </div>
          <div class="flex gap-4">
            <details v-if="tags.length > 0" class="toolbar-details">
              <summary class="app-btn" style="font-size: 14px">Tag +</summary>
              <ul class="toolbar-menu">
                <li
                  class="flex gap-4 align-center"
                  v-for="tag in tags"
                  :key="tag.id"
                  @click="addTagToNote(tag)"
                >
                  <Tag :style="`color: var(--${tag.color} `" />
                  <span>{{ tag.name }}</span>
                </li>
              </ul>
            </details>
            <select v-model="selectedNote.status" @change="changeNoteStatus">
              <option disabled selected>{{ $t("status") }}</option>
              <option value="todo">{{ $t("todo") }}</option>
              <option value="inprogress">{{ $t("inprogress") }}</option>
              <option value="finished">{{ $t("finished") }}</option>
              <option value="archived">{{ $t("archived") }}</option>
            </select>

            <button v-if="!showBoth" @click="togglePreviewMode">
              <EyeOff v-if="isPreviewMode" />
              <Eye v-else />
            </button>
            <button @click="toggleShowBoth">
              <Columns2 />
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
              ><X />
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
            ></textarea>
          </div>
          <hr id="separator-column" />
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
            ></textarea>
          </div>
          <div v-else id="markdown-container" v-html="getMarkdownHtml()"></div>
        </div>
      </div>
    </div>
    <div class="column-note img" v-else>
      <img src="/image3-removebg-preview.png" />
    </div>
  </div>
  <Notification
    :message="messageNotification"
    :color="colorNotification"
    :showNotification="isVisibleNotification"
  />
  <Statusbar :noteLength="getContentNoteLength" />
</template>

<script>
import Titlebar from "./components/Titlebar.vue";
import Toolbar from "./components/Toolbar.vue";
import Sidebar from "./components/Sidebar.vue";
import Notelist from "./components/Notelist.vue";
import Notebar from "./components/Notebar.vue";
import Statusbar from "./components/Statusbar.vue";
import { Plus, Eye, EyeOff, Tag, X, Columns2 } from "lucide-vue-next";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import Notification from "./components/Notification.vue";
import { marked } from "marked";

export default {
  name: "App",
  components: {
    Titlebar,
    Toolbar,
    Sidebar,
    Notelist,
    Notebar,
    Notification,
    Statusbar,
    Plus,
    Eye,
    EyeOff,
    Tag,
    X,
    Columns2,
  },
  data() {
    return {
      isVisibleMenu: true,
      isVisibleNoteList: true,
      isVisibleNoteBar: true,
      isMarkdownMode: true,
      isPreviewMode: false,
      showBoth: false,
      notes: [],
      status: "",
      color: "",
      searchNote: "",
      tags: [],
      noteCounters: {},
      filter: "",
      timerNotification: null,
      isVisibleNotification: false,
      messageNotification: "",
      colorNotification: "",
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
  },
  methods: {
    getMarkdownHtml() {
      return marked(this.selectedNoteContent, { sanitize: true });
    },
    toggleMarkdown() {
      this.isPreviewMode = !this.isPreviewMode;
    },
    toggleShowBoth() {
      this.showBoth = !this.showBoth;
      console.log(this.showBoth);
    },
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
        case "exit":
          this.exit();
          break;
        default:
          alert(`Unknown action: ${action}`);
          break;
      }
    },
    createNewDocument() {
      this.createNote();
    },
    async openDocument() {
      const selectedFile = await open({
        multiple: false,
        filters: [{ name: "Fichiers texte", extensions: ["txt", "md"] }],
      });
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

      if (selectedFile) {
        try {
          const content = await readTextFile(selectedFile);
          console.log(content);
          let newNote = {
            id: Date.now(),
            name: fileName,
            date: new Date().toLocaleString("fr-FR"),
            status: "",
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
      }
    },

    // async saveDocument() {
    //   if (!this.selectedNote) {
    //     return;
    //   }
    //   const defaultFileName = this.selectedNote.name + ".md";

    //   const filePath = await ipcRenderer.invoke(
    //     "dialog:saveAs",
    //     defaultFileName
    //   );

    //   if (filePath) {
    //     const status = this.selectedNote.status;
    //     const content = status + "\r\n" + this.selectedNote.content;

    //     const result = await ipcRenderer.invoke("file:save", {
    //       filePath,
    //       content,
    //     });

    //     if (result && result.success) {
    //       console.log("Fichier enregistré à :", filePath);
    //     } else {
    //       console.error("Erreur lors de l'enregistrement du fichier.");
    //     }
    //   }
    // },
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
        name: this.generateIncrementedName("Note"),
        date: new Date().toLocaleString("fr-FR"),
        status: "todo",
        color: "red",
        content: "",
        tags: [],
        selected: false,
      };
      this.notes.push(newNote);
      this.showNotification(
        this.$t("note_created", { note_name: newNote.name }),
        "green"
      );
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
      if (note.selected) {
        note.selected = false;
      } else {
        this.notes.forEach((n) => {
          n.selected = false;
        });
        note.selected = true;
      }
    },
    deleteNote(note) {
      const index = this.notes.findIndex((n) => n.id === note.id);
      if (index > -1) {
        this.notes.splice(index, 1);
        this.showNotification(
          this.$t("note_deleted", { note_name: note.name }),
          "green"
        );
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
    syncScroll(source) {
      const div1 = this.$refs.div1;
      const div2 = this.$refs.div2;

      if (source === "div1") {
        div2.scrollTop = div1.scrollTop;
      } else {
        div1.scrollTop = div2.scrollTop;
      }
    },
  },
  beforeDestroy() {
    clearTimeout(this.timerNotification);
  },
};
</script>
<style>
#container {
  height: calc(100vh - 95px);
  display: flex;
}

.column-sidebar {
  max-width: 200px;
  background: var(--bg-sidebar);
  border-right: var(--border);
}
.column-notelist {
  border-right: var(--border);
  max-width: 320px;
}
.sub-col3 {
  position: relative;
  max-width: calc(100vw - 460px);
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
  width: 50%;
  margin: auto;
  user-select: none;
}
img {
  width: 100%;
}
#bothColumns {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: calc(100vh - 205px);
}
#separator-column {
  border-left: none;
  border-right: 1px solid var(--grey);
  height: 100%;
  margin: 0 1rem;
}
#oneView {
  height: calc(100vh - 205px);
}
#oneView div {
  height: 100%;
}
#bothColumns div {
  height: 100%;
}
</style>
