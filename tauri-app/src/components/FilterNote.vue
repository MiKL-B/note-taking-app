<template>
  <div id="filter-note">
    <DetailsCompo :title="$t('filters_sort')" btn="app-btn">
      <template v-slot:header><Filter class="size-16" /></template>
      <template v-slot:content>
        <li class="flex gap-4 align-center" @click="sortNotesAZ">
          <ArrowDownAZ v-if="sortAZ" class="size-16" />
          <ArrowUpZA v-else class="size-16" />
          <span>{{ sortAZ ? $t("sortAZ") : $t("sortZA") }}</span>
        </li>
        <li class="flex gap-4 align-center" @click="sortNotesByDate">
          <Calendar class="size-16" />
          <span>{{ sortDate ? $t("sort_oldest") : $t("sort_newest") }}</span>
        </li>
        <li class="flex gap-4 align-center" @click="clearFilterSort">
          <FilterX class="size-16" />
          <span>{{ $t("clear_filter") }}</span>
        </li>
      </template>
    </DetailsCompo>

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
import DetailsCompo from "./DetailsCompo.vue";

export default {
  name: "FilterNote",
  components: {
    Plus,
    ArrowDownAZ,
    ArrowUpZA,
    Filter,
    Calendar,
    FilterX,
    DetailsCompo,
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
