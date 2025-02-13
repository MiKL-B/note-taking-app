<template>
  <div id="notebar" @wheel.prevent="handleScroll">
    <!-- status -->
    <select
      :value="modelValue"
      @change="changeNoteStatus($event.target.value)"
      :title="$t('status')"
    >
      <option disabled selected>{{ $t("status") }}</option>
      <option :value="item" v-for="item in status">{{ $t(item) }}</option>
    </select>
    <!-- add tag -->

    <div id="suggestion-container">
      <input
        type="text"
        v-model="input"
        @input="updateSuggestions"
        @keyup.enter="addTagToNote"
        :placeholder="$t('add_tags')"
        pattern="[a-zA-ZÀ-ÿ]+"
        style="max-width: 120px; user-select: none"
      />
      <ChevronDown
        @click="toggleSuggestion"
        class="suggestion-chevron size-16"
      />
      <ul id="suggestion-list" v-if="suggestions.length > 0">
        <li
          class="flex align-center gap-4"
          v-for="suggestion in suggestions"
          @click="selectSuggestion(suggestion)"
        >
          <Tag :style="`color: var(--${suggestion.color}) `" class="size-16" />
          <span>
            {{ suggestion.name }}
          </span>
        </li>
      </ul>
      <ul id="suggestion-list" v-else-if="isVisibleSuggestionList">
        <li
          class="flex align-center gap-4"
          v-for="suggestion in secondList"
          @click="selectSuggestion(suggestion)"
        >
          <Tag :style="`color: var(--${suggestion.color}) `" class="size-16" />
          <span>
            {{ suggestion.name }}
          </span>
        </li>
      </ul>
    </div>
    <!-- insert -->
    <select v-model="insertValue" @change="insertItem" :title="$t('insert')">
      <option disabled selected>{{ $t("insert") }}</option>
      <option :value="item" v-for="item in insertItems">{{ $t(item) }}</option>
    </select>
    <span class="separator-y"></span>
    <!-- important -->
    <button
      @click="toggleImportantNote"
      :title="isPinned ? $t('unimportant_note') : $t('important_note')"
    >
      <FileWarning
        class="size-16"
        :style="isImportant ? 'color:var(--red)' : ''"
      />
    </button>
    <!-- pin -->
    <button
      @click="togglePinNote"
      :title="isPinned ? $t('unpin_note') : $t('pin_note')"
    >
      <PinOff v-if="isPinned" class="size-16" />
      <Pin v-else class="size-16" />
    </button>
    <!-- duplicate -->
    <button @click="duplicateNote" :title="$t('duplicate')">
      <CopyPlus class="size-16" />
    </button>
    <span class="separator-y"></span>
    <!-- preview -->
    <button
      :disabled="showBoth"
      @click="togglePreviewMode"
      :title="$t('toggle_preview')"
    >
      <EyeOff v-if="isPreviewMode" class="size-16" />
      <Eye v-else class="size-16" />
    </button>
    <!-- both view -->
    <button @click="toggleShowBothTextareaPreview" :title="$t('side_by_side')">
      <Columns2 class="size-16" />
    </button>
  </div>
</template>

<script>
import {
  Tag,
  CopyPlus,
  Columns2,
  EyeOff,
  Eye,
  Pin,
  PinOff,
  FileWarning,
  ChevronDown,
} from "lucide-vue-next";
export default {
  name: "Notebar",
  components: {
    Tag,
    CopyPlus,
    Columns2,
    EyeOff,
    Eye,
    Pin,
    PinOff,
    FileWarning,
    ChevronDown,
  },
  props: ["tags", "showBoth", "modelValue", "isPinned", "isImportant"],
  emits: [
    "add-tag-note",
    "duplicate-note",
    "toggle-showboth",
    "toggle-preview-mode",
    "update-status",
    "toggle-pin-note",
    "toggle-important-note",
    "insert-item",
  ],
  data() {
    return {
      isPreviewMode: false,
      isVisibleSuggestionList: false,
      secondList:this.tags,
      input: "",
      status: ["todo", "inprogress", "finished", "archived"],
      suggestions: [],
      insertValue: "",
      insertItems: [
        "heading1",
        "heading2",
        "heading3",
        "heading4",
        "heading5",
        "heading6",
        "checkbox",
        "separator",
        "blockquote",
        "image",
        "code",
        "table",
        "link",
        "date",
        "time",
      ],
    };
  },
  methods: {
    handleScroll(event) {
      const scrollSpeed = 0.2;
      const deltaY = event.deltaY * scrollSpeed;

      const notebar = this.$el;

      notebar.scrollBy({
        top: deltaY,
        left: 0,
        behavior: "smooth",
      });
    },
    addTagToNote() {
      this.$emit("add-tag-note", this.input);
      this.input = "";
      this.suggestions = [];
    },
    duplicateNote() {
      this.$emit("duplicate-note");
    },
    toggleShowBothTextareaPreview() {
      this.$emit("toggle-showboth");
    },
    togglePreviewMode() {
      this.isPreviewMode = !this.isPreviewMode;
      this.$emit("toggle-preview-mode");
    },
    togglePinNote() {
      this.$emit("toggle-pin-note");
    },
    toggleImportantNote() {
      this.$emit("toggle-important-note");
    },
    changeNoteStatus(value) {
      this.$emit("update-status", value);
    },
    updateSuggestions() {
      if (this.input) {
        this.suggestions = this.tags.filter((word) =>
          word.name.toLowerCase().includes(this.input.toLowerCase())
        );
      } else {
        this.suggestions = [];
      }
    },
    selectSuggestion(suggestion) {
      this.input = suggestion.name;
      this.suggestions = [];
      this.isVisibleSuggestionList = false;
      this.addTagToNote();
    },
    insertItem() {
      this.$emit("insert-item", this.insertValue);
      this.insertValue = "";
    },
    toggleSuggestion() {
      this.isVisibleSuggestionList = !this.isVisibleSuggestionList;
    },
  },
};
</script>

<style scoped>
#notebar {
  border-bottom: var(--border);
  padding: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  height: 42px;
  overflow-y: auto;
  background: var(--bg-notebar);
  color: var(--text-color-notebar);
}
#suggestion-container {
  position: relative;
}
#suggestion-list {
  position: fixed;
  list-style-type: none;
  background-color: var(--bg-toolbar);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 0.5rem 0.2rem;
  min-width: 120px;
  user-select: none;
}
#suggestion-list li {
  padding: 0.2rem;
  border-radius: 5px;
  user-select: none;
}
#suggestion-list li:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}
.suggestion-chevron {
  position: absolute;
  top: 0;
  right: 2px;
  height: 100%;
}
</style>
