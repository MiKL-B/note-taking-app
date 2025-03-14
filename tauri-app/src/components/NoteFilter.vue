<template>
  <MenuDropdown title="" :icon="filter" btn="app-btn">
    <template v-slot:content>
      <li class="flex gap-4 align-center" @click="sortNotesAZ">
        <AppIcon iconName="ArrowDownAZ" v-if="sortAZ" class="size-16" />
        <AppIcon iconName="ArrowUpZA" v-else class="size-16" />
        {{ sortAZ ? $t("sortZA") : $t("sortAZ") }}
      </li>
      <li class="flex gap-4 align-center" @click="sortNotesByDate">
        <AppIcon iconName="Calendar" class="size-16" />
        {{ sortDate ? $t("sort_newest") : $t("sort_oldest") }}
      </li>
      <li class="flex gap-4 align-center" @click="clearFilterSort">
        <AppIcon iconName="FilterX" class="size-16" />
        {{ $t("clear_filter") }}
      </li>
    </template>
  </MenuDropdown>
</template>

<script>
import MenuDropdown from "./MenuDropdown.vue";
import AppIcon from "./AppIcon.vue";
import { Filter } from "lucide-vue-next";
export default {
  name: "NoteFilter",
  components: {
    MenuDropdown,
    AppIcon,
    Filter,
  },

  emits: [
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
  },
};
</script>