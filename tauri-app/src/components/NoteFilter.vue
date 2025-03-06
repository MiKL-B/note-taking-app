<template>
  <div id="note-filter">
    <MenuDropdown title="" :icon="filter" btn="app-btn">
      <template v-slot:content>
        <li class="flex gap-4 align-center" @click="sortNotesAZ">
          <ArrowDownAZ v-if="sortAZ" class="size-16" />
          <ArrowUpZA v-else class="size-16" />
          {{ sortAZ ? $t("sortZA") : $t("sortAZ") }}
        </li>
        <li class="flex gap-4 align-center" @click="sortNotesByDate">
          <Calendar class="size-16" />
          {{ sortDate ? $t("sort_newest") : $t("sort_oldest") }}
        </li>
        <li class="flex gap-4 align-center" @click="clearFilterSort">
          <FilterX class="size-16" />
          {{ $t("clear_filter") }}
        </li>
      </template>
    </MenuDropdown>

    <input
      type="text"
      :value="modelValue"
      :placeholder="$t('filter_note_by_name')"
      @input="updateSearchNote($event.target.value)"
      style="width: 160px"
    />
    <button
      :disabled="!canCreateNote"
      @click="createNote"
      :title="$t('create_note')"
    >
      <Plus class="size-16" />
    </button>
  </div>
</template>

<script>
import {
  Plus,
  ArrowDownAZ,
  ArrowUpZA,
  Filter,
  Calendar,
  FilterX,
} from "lucide-vue-next";
import MenuDropdown from "./MenuDropdown.vue";

export default {
  name: "NoteFilter",
  components: {
    Plus,
    ArrowDownAZ,
    ArrowUpZA,
    Filter,
    Calendar,
    FilterX,
    MenuDropdown,
  },
  props: ["modelValue", "canCreateNote"],
  emits: [
    "update:modelValue",
    "create-note",
    "sort-notes-AZ",
    "sort-notes-date",
    "sort-notes-clear",
  ],
  data() {
    return {
      sortAZ: true,
      sortDate: true,
      filter: Filter,
    };
  },
  methods: {
    createNote() {
      this.$emit("create-note");
    },
    sortNotesAZ() {
      this.sortAZ = !this.sortAZ;
      this.$emit("sort-notes-AZ");
    },
    sortNotesByDate() {
      this.sortDate = !this.sortDate;
      this.$emit("sort-notes-date");
    },
    clearFilterSort() {
      this.sortAZ = true;
      this.sortDate = true;
      this.$emit("sort-notes-clear");
    },
    updateSearchNote(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
<style>
#note-filter {
  border-bottom: var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  padding:0.2rem;
  gap:0.2rem;
}
</style>
