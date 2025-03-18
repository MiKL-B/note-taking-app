<template>
  <AppDropdown icon="Filter" btn="app-btn">
    <template v-slot:content>
      <li class="flex gap-4 align-center" @click="sortNotesAZ">
        <AppIcon iconName="ArrowDownAZ" v-if="sortAZ" />
        <AppIcon iconName="ArrowUpZA" v-else />
        {{ sortAZ ? $t("sortZA") : $t("sortAZ") }}
      </li>
      <li class="flex gap-4 align-center" @click="sortNotesByDate">
        <AppIcon iconName="Calendar" />
        {{ sortDate ? $t("sort_newest") : $t("sort_oldest") }}
      </li>
      <li class="flex gap-4 align-center" @click="clearFilterSort">
        <AppIcon iconName="FilterX" />
        {{ $t("clear_filter") }}
      </li>
    </template>
  </AppDropdown>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import AppDropdown from "./AppDropdown.vue";
import AppIcon from "./AppIcon.vue";
const emit = defineEmits(['sort-notes-AZ', 'sort-notes-date', 'sort-notes-clear'])
let sortAZ = ref(true);
let sortDate = ref(true);

const sortNotesAZ = () => {
  sortAZ.value = !sortAZ.value;
  emit('sort-notes-AZ');
}
const sortNotesByDate = () => {
  sortDate.value = !sortDate.value;
  emit("sort-notes-date");
}
const clearFilterSort = () => {
  sortAZ.value = true;
  sortDate.value = true;
  emit("sort-notes-clear");
}
</script>