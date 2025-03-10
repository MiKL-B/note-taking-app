<template>
  <div id="notebar" @wheel.prevent="handleScroll">
    <!-- status -->
    <select
      :value="modelValue"
      @change="changeNoteStatus($event.target.value)"
      :title="$t('status')"
    >
      <option disabled selected>{{ $t("status") }}</option>
      <option :value="item.status_ID" v-for="item in status">
        {{ $t(item.name) }}
      </option>
    </select>

    <!-- add tag -->

    <!--   <div id="suggestion-container">
      <input
        type="text"
        v-model="input"
        @keyup.enter="addTagToNote"
        :placeholder="$t('add_tags')"
        pattern="[a-zA-ZÀ-ÿ]+"
        style="max-width: 120px; user-select: none"
      />
      <ChevronDown
        @click="toggleSuggestion"
        class="suggestion-chevron size-16"
      />

      <ul id="suggestion-list" v-if="isVisibleSuggestionList && tags.length > 0">
        <li
          class="flex align-center gap-4"
          v-for="tag in tags"
          @click="selectSuggestion(tag)"
        >
          <Tag :style="`color: var(--${tag.color}) `" class="size-16" />
          <span>
            {{ tag.name }}
          </span>
        </li>
      </ul>
    </div> -->
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
      <AppIcon
        iconName="FileWarning"
        class="size-16"
        :style="isImportant ? 'color:var(--red)' : ''"
      />
    </button>
    <!-- pin -->
    <button
      @click="togglePinNote"
      :title="isPinned ? $t('unpin_note') : $t('pin_note')"
    >
      <AppIcon iconName="PinOff" v-if="isPinned" class="size-16" />
      <AppIcon iconName="Pin" v-else class="size-16" />
    </button>
    <!-- duplicate -->
    <button @click="duplicateNote" :title="$t('duplicate_note')">
      <AppIcon iconName="CopyPlus" class="size-16"/>
    </button>
    <span class="separator-y"></span>
    <!-- preview -->
    <button
      :disabled="showBoth"
      @click="togglePreviewMode"
      :title="$t('toggle_preview')"
    >
      <AppIcon iconName="EyeOff" v-if="isPreviewMode" class="size-16"/>
      <AppIcon iconName="Eye" v-else class="size-16"/>
    </button>
    <!-- both view -->
    <button @click="toggleShowBothTextareaPreview" :title="$t('side_by_side')">
      <AppIcon iconName="Columns2" class="size-16"/>
    </button>
  </div>
</template>

<script>
import AppIcon from "./AppIcon.vue";
import DatabaseService from "../database.js";

export default {
  name: "Notebar",
  components: {
    AppIcon,
  },
  props: ["tags", "showBoth", "modelValue", "isImportant", "isPinned"],
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
  async mounted() {
    this.status = await DatabaseService.getStatus();
  },
  data() {
    return {
      isPreviewMode: false,
      isVisibleSuggestionList: false,
      input: "",
      status: [],
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

    selectSuggestion(suggestion) {
      this.input = suggestion.name;
      this.addTagToNote();
    },

    insertItem() {
      let text = "";
      switch (this.insertValue) {
        case "heading1":
          text = "# Heading 1";
          break;
        case "heading2":
          text = "## Heading 2";
          break;
        case "heading3":
          text = "### Heading 3";
          break;
        case "heading4":
          text = "#### Heading 4";
          break;
        case "heading5":
          text = "##### Heading 5";
          break;
        case "heading6":
          text = "###### Heading 6";
          break;
        case "checkbox":
          text = "- [ ] Checkbox";
          break;
        case "separator":
          text = "---";
          break;
        case "blockquote":
          text = "> Quote\r\n";
          break;
        case "image":
          text = "![Alt text](https://picsum.photos/200/300 'A title')";
          break;
        case "code":
          text = "```\r\n";
          text += "code \r\n";
          text += "```";
          break;
        case "table":
          text = `| Column1 | Column2|
| ------ | ------ |
| Row 1| value 2|
| Row 2|value 2 |\r\n`;
          break;
        case "link":
          text = "[Link name](https://www.markdownguide.org/)";
          break;
        case "date":
          text = new Date().toLocaleString("fr-FR").split(" ")[0];
          break;
        case "time":
          text = new Date().toLocaleString("fr-FR").split(" ")[1];
          break;
      }
      this.$emit("insert-item", text);
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
