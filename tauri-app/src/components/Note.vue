<template>
  <div class="column-note-content">
    <div id="column-note-title">
      <NoteStatusColor :status_ID="selectedNote.status_ID" />
      <input
        id="input-note-name"
        type="text"
        v-model="selectedNote.name"
        :placeholder="$t('note_name_here')"
      />
    </div>
    <div class="note-tag-list">
      <span
        v-for="tag in noteTags"
        :style="`background: var(--${tag.color})`"
        class="tag"
      >
        {{ tag.name }}
        <span class="delete-tag-btn" @click="deleteNoteTag(tag)">
          <AppIcon iconName="X" class="size-16" />
        </span>
      </span>
    </div>

    <div id="bothColumns" v-show="showBoth">
      <codemirror
        ref="codemirror"
        :style="{ height: 'calc(100vh - 200px);' }"
        @change="markAsModified"
        v-model="selectedNote.content"
        :extensions="extensionsList"
        :options="options"
        @ready="handleReady"
      />

      <hr class="separator-column" />
      <div id="markdown-container" v-html="getMarkdownHtml"></div>
    </div>
    <div id="oneView" v-show="!showBoth">
      <div v-show="!isPreviewMode">
        <codemirror
          ref="codemirror"
          :style="{ height: 'calc(100vh - 200px);' }"
          @change="markAsModified"
          v-model="selectedNote.content"
          :extensions="extensionsList"
          :options="options"
          @ready="handleReady"
        />
      </div>
      <div
        v-show="isPreviewMode"
        id="markdown-container"
        class="oneViewMarkdown"
        v-html="getMarkdownHtml"
      ></div>
    </div>
    <NoteStatusbar
      :characterCount="getCharacterNoteCount"
      :wordCount="getWordNoteCount"
    />
  </div>
</template>

<script>
import { Codemirror } from "vue-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { basicLight } from "../assets/index.ts";
import {everforest } from '../assets/everforest.ts';
import { marked } from "marked";
import AppIcon from "./AppIcon.vue";
import DOMPurify from "dompurify";
import NoteStatusbar from "./NoteStatusbar.vue";
import NoteStatusColor from "./NoteStatusColor.vue";

export default {
  name: "Note",
  props: ["selectedNote", "isPreviewMode", "showBoth", "notes"],
  emits: ["delete-note-tag", "mark-as-modified"],
  components: {
    NoteStatusbar,
    AppIcon,
    NoteStatusColor,
    Codemirror,
  },
  data() {
    return {
      font: localStorage.getItem("font") || "Inter",
      fontSize: localStorage.getItem("font-size") || 16,
      theme:localStorage.getItem("theme") || "light",
      view: null,
      options: {
        highlightFormatting: true,
      },
    };
  },

  computed: {
    extensionsList(){
      let extension = this.theme === "dark" ? everforest : basicLight
      return [markdown(),extension]
    },
    noteTags() {
      if (this.selectedNote.tags === "") return [];
      return JSON.parse(this.selectedNote.tags);
    },
    dynamicStyle() {
      return {
        fontSize: this.fontSize + "px",
        fontFamily: this.font,
      };
    },
    getMarkdownHtml() {
      marked.setOptions({
        async: false,
        extensions: null,
        hooks: null,
        pedantic: false,
        silent: false,
        tokenizer: null,
        walkTokens: null,
        gfm: true,
        sanitize: false,
        tables: true,
        breaks: true,
        smartLists: true,
        smartypants: false,
        gfm: true,
        breaks: true,
      });
      const renderer = new marked.Renderer();

      renderer.link = (token) => {
        return `<a href="${token.href}" title="${token.title}" target="_blank">${token.text}</a>`;
      };

      marked.use({ renderer });
      const dirtyHTML = marked(this.selectedNote.content);
      return DOMPurify.sanitize(dirtyHTML);
    },

    getCharacterNoteCount() {
      const selectedNote = this.notes.find((note) => note.selected);
      return selectedNote ? selectedNote.content.length : "";
    },
    getWordNoteCount() {
      const selectedNote = this.notes.find((note) => note.selected);
      return selectedNote ? selectedNote.content.split(" ").length - 1 : "";
    },
  },

  methods: {
    handleReady(payload) {
      this.view = payload.view;
    },

    getCodemirrorStates() {
      const state = this.view.state;
      const ranges = state.selection.ranges;
      const selected = ranges.reduce(
        (r, range) => r + range.to - range.from,
        0
      );
      const cursor = ranges[0].anchor;
      const length = state.doc.length;
      const lines = state.doc.lines;
      return {
        selected,
        cursor,
        length,
        lines,
      };
    },
    deleteNoteTag(tag) {
      this.$emit("delete-note-tag", tag);
    },
    markAsModified() {
      this.$emit("mark-as-modified");
    },
  },
};
</script>

<style>
.column-note-content {
  background: var(--bg-note);
  color: var(--text-color-note);
  min-width: 50%;
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

.note-tag-list {
  flex-wrap: wrap;
  overflow-y: scroll;
  max-height: 26px;
  height: 26px;
  display: flex;
  gap: 0.2rem;
  padding-left: 0.2rem;
}

#bothColumns {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: calc(100vh - 200px);
}

.separator-column {
  border-left: none;
  border-right: 1px solid var(--grey);
  height: 100%;
  margin: 0 1rem;
}

.cm-focused {
  outline: none !important;
}

.cm-activeLine,
.cm-gutter {
  background: none !important;
  background: var(--lightgrey2) !important;
}

.cm-lineNumbers {
  color: var(--lineNumbers) !important;
}

.cm-activeLineGutter {
  background: none !important;
}
.ͼ4 .cm-line::selection,
.ͼo .cm-content ::selection {
  background: rgb(215, 233, 240) !important;
}
.ͼ1j {
  font-weight: bold;
}
.ͼt {
  font-style: italic;
}
.ͼ18 {
  text-decoration: none;
}
#bothColumns .cm-editor {
  min-width: 200px;
  max-width: 900px;
}

#oneView .cm-editor {
  width: calc(100% - 2px);
}

.cm-line {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.cm-content,
.cm-gutters {
  font-size: 18px;
}

.delete-tag-btn {
  cursor: pointer;
  color: var(--dark2);
}
</style>
