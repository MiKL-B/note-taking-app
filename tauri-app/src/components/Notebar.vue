<template>
  <div id="notebar" @wheel.prevent="handleScroll">
    <!-- <select name="" id="">
      <option value="" disabled selected>{{$t('font')}}</option>
      <option value="">Arial</option>
      <option value="">Time New Roman</option>
      <option value="">Roboto</option>
      <option value="">Ubuntu</option>
    </select>
    <select name="" id="">
      <option value="" disabled selected>{{$t('font_size')}}</option>
      <option value="">12</option>
      <option value="">14</option>
      <option value="">16</option>
      <option value="">18</option>
    </select> -->
    <select :value="modelValue" @change="changeNoteStatus($event.target.value)">
      <option disabled selected>{{ $t("status") }}</option>
      <option value="todo">{{ $t("todo") }}</option>
      <option value="inprogress">{{ $t("inprogress") }}</option>
      <option value="finished">{{ $t("finished") }}</option>
      <option value="archived">{{ $t("archived") }}</option>
    </select>
    <details class="toolbar-details">
      <summary
        :class="tags.length <= 0 ? 'disabled' : ''"
        class="app-btn"
        style="font-size: 14px"
      >
        {{$t('add_tag')}}
      </summary>
      <ul class="toolbar-menu">
        <li
          class="flex gap-4 align-center"
          v-for="tag in tags"
          :key="tag.id"
          @click="addTagToNote(tag)"
        >
          <Tag :style="`color: var(--${tag.color}) `" class="size-16"/>
          <span>{{ tag.name }}</span>
        </li>
      </ul>
    </details>
    <span class="separator-y"></span>
    <button @click="toggleImportantNote" :title="isPinned ? $t('unimportant_note') : $t('important_note')">
      <FileWarning class="size-16" :style="isImportant ? 'color:var(--red)': ''"/>
    </button>
    <button @click="togglePinNote" :title="isPinned ? $t('unpin_note') : $t('pin_note')">
      <PinOff v-if="isPinned" class="size-16"/>
      <Pin v-else class="size-16"/>
    </button>
    <button @click="duplicateNote" :title="$t('duplicate')">
      <CopyPlus class="size-16"/>
    </button>
    <span class="separator-y"></span>
    <button :disabled="showBoth" @click="togglePreviewMode" :title="$t('toggle_preview')">
      <EyeOff v-if="isPreviewMode" class="size-16"/>
      <Eye v-else class="size-16"/>
    </button>
    <button @click="toggleShowBothTextareaPreview" :title="$t('side_by_side')">
      <Columns2 class="size-16"/>
    </button>
    <!-- <span class="separator-y"></span>
    <button class="bt-symbol" title="Bold">
      <Bold />
    </button>
    <button class="bt-symbol" title="Italic">
      <Italic />
    </button>
    <button class="bt-symbol" title="Underline">
      <Underline />
    </button>
    <input type="color" />
    <span class="separator-y"></span>
    <button class="bt-symbol" title="Align left">
      <AlignLeft />
    </button>
    <button class="bt-symbol" title="Align center">
      <AlignCenter />
    </button>
    <button class="bt-symbol" title="Align right">
      <AlignRight />
    </button>
    <button class="bt-symbol" title="Align justify">
      <AlignJustify />
    </button> -->
  </div>
</template>

<script>
import {
  // Bold,
  // Italic,
  // Underline,
  // AlignLeft,
  // AlignCenter,
  // AlignRight,
  // AlignJustify,
  Tag,
  CopyPlus,
  Columns2,
  EyeOff,
  Eye,
  Pin,
  PinOff,
  FileWarning
} from "lucide-vue-next";
export default {
  name: "Notebar",
  components: {
    // Bold,
    // Italic,
    // Underline,
    // AlignLeft,
    // AlignCenter,
    // AlignRight,
    // AlignJustify,
    Tag,
    CopyPlus,
    Columns2,
    EyeOff,
    Eye,
    Pin,
    PinOff,
    FileWarning
  },
  props: ["tags", "showBoth","modelValue","isPinned","isImportant"],
  emits: [
    "add-tag-note",
    "duplicate-note",
    "toggle-showboth",
    "toggle-preview-mode",
    "update-status",
    "toggle-pin-note",
    "toggle-important-note"
  ],
  data() {
    return {
      isPreviewMode: false,
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
    addTagToNote(tag) {
      this.$emit("add-tag-note", tag);
    },
    duplicateNote() {
      this.$emit("duplicate-note");
    },
    toggleShowBothTextareaPreview() {
      this.$emit("toggle-showboth");
    },
    togglePreviewMode() {
      this.isPreviewMode = !this.isPreviewMode
      this.$emit("toggle-preview-mode");
    },
    togglePinNote(){
      this.$emit("toggle-pin-note")
    },
    toggleImportantNote(){
      this.$emit("toggle-important-note")
    },
    changeNoteStatus(value){
      this.$emit("update-status",value)
    }
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
  background:var(--bg-notebar);
  color:var(--text-color-notebar);
}
</style>
