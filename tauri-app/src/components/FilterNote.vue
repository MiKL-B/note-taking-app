<template>
  <div id="filter-note">
    <button @click="sortNotes" :title="$t('sortAZ')">
      <ArrowDownAZ v-if="sortAZ" class="size-16" />
      <ArrowUpZA v-else class="size-16" />
    </button>
    <input
      type="text"
      :value="modelValue"
      :placeholder="$t('filter_note_by_name')"
      @input="updateSearchNote($event.target.value)"
      style="width: 160px"
    />
    <button @click="createNote" :title="$t('create_note')">
      <Plus class="size-16" />
    </button>
  </div>
</template>

<script>
import { Plus, ArrowDownAZ, ArrowUpZA } from "lucide-vue-next";

export default {
  name: "FilterNote",
  components: {
    Plus,
    ArrowDownAZ,
    ArrowUpZA,
  },
  props: ["modelValue"],
  emits: ["update:modelValue", "create-note", "sort-notes"],
  data() {
    return {
      sortAZ: true,
    };
  },
  methods: {
    createNote() {
      this.$emit("create-note");
    },
    sortNotes() {
      this.sortAZ = !this.sortAZ;
      this.$emit("sort-notes");
    },
    updateSearchNote(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
