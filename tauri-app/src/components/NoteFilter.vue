<template>
  <AppDropdown icon="Filter" :items="items" btn="app-btn"/>
</template>

<script lang="ts" setup>
import { ref, onMounted,watch } from "vue";
import AppDropdown from "./AppDropdown.vue";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const emit = defineEmits(['sort-notes-AZ', 'sort-notes-date', 'sort-notes-clear'])
let sortAZ = ref(true);
let sortDate = ref(true);
interface MenuItem {
  text: string;
  action: () => void;
}
const items = ref<MenuItem[]>([]);


function updateItemsText ()  {
  items.value = [
    {
      text: sortAZ.value ? t('sortAZ') : t('sortZA'),
      action: () => sortNotesAZ()
    },
    {
      text: sortDate.value ? t("sort_newest") : t("sort_oldest"),
      action: () => sortNotesByDate()
    },
    {
      text: t("clear_filter"),
      action: () => clearFilterSort()
    }
  ];
};
onMounted(()=>{
  updateItemsText();
})
watch(locale, () => {
  updateItemsText(); 
})

const sortNotesAZ = () => {
  sortAZ.value = !sortAZ.value;
  updateItemsText();
  emit('sort-notes-AZ');
}
const sortNotesByDate = () => {
  sortDate.value = !sortDate.value;
  updateItemsText();
  emit("sort-notes-date");
}
const clearFilterSort = () => {
  sortAZ.value = true;
  sortDate.value = true;
  updateItemsText();
  emit("sort-notes-clear");
}
</script>