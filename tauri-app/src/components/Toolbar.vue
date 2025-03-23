<template>
  <div id="toolbar">
    <AppDropdown :title="$t('file')" :items="itemsFile" btn="toolbar_btn" />
    <!-- <AppDropdown :title="$t('edit')" :items="itemsEdit" btn="toolbar_btn" /> -->

    <AppDropdown :title="$t('view')" :items="itemsView" btn="toolbar_btn" />
    <AppDropdown
      :title="$t('settings')"
      :items="itemsSettings"
      btn="toolbar_btn"
    />
    <AppDropdown :title="$t('about')" :items="itemsAbout" btn="toolbar_btn" />
  </div>
</template>

<script lang="ts" setup>
import AppDropdown from "./AppDropdown.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const props = defineProps(["distractionFree"]);
const emit = defineEmits(["action-clicked", "select-view", "display-about"]);
const onSubMenuClick = (action: String) => emit("action-clicked", action);
const displayAbout = () => emit("display-about");
let currentView = ref(localStorage.getItem("view") || "default");
let currentLanguage = ref(localStorage.getItem("language") || "en");
let currentFont = ref(localStorage.getItem("font") || "Inter");
let currentFontSize = ref(localStorage.getItem("font-size") || 16);
let currentTheme = ref(localStorage.getItem("theme") || "light");

onMounted(() => {
  selectView(currentView.value);
  selectLanguage(currentLanguage.value);
  selectFont(currentFont.value);
  selectFontSize(currentFontSize.value.toString());
  selectTheme(currentTheme.value);
});
const itemsFile = ref([
  {
    text: t("newnote"),
    cmd: "Ctrl + N",
    action: () => {
      onSubMenuClick("newnote");
    },
  },
  {
    text: t("duplicate_note"),
    cmd: "Ctrl + D",
    action: () => {
      onSubMenuClick("duplicate_note");
    },
  },
  {
    text: t("save"),
    cmd: "Ctrl + S",
    separator: true,
    action: () => {
      onSubMenuClick("save");
    },
  },
  {
    text: t("export"),
    items: [
      {
        text: "JSON",
        action: () => {
          onSubMenuClick("exportjson");
        },
      },
    ],
  },
  {
    text: t("import"),
    separator: true,
    items: [
      {
        text: "JSON",
        action: () => {
          onSubMenuClick("importjson");
        },
      },
    ],
  },
  {
    text: t("exit"),
    cmd: "Ctrl + Q",
    action: () => {
      onSubMenuClick("exit");
    },
  },
]);
// edit
const itemsEdit = ref([
  {
    text: t("undo"),
    cmd: "Ctrl + Z",
  },
  {
    text: t("redo"),
    cmd: "Ctrl + Y",
    separator: true,
  },
  {
    text: t("cut"),
    cmd: "Ctrl + X",
  },
  {
    text: t("ccopy"),
    cmd: "Ctrl + C",
  },
  {
    text: t("paste"),
    cmd: "Ctrl + V",
    separator: true,
  },
  {
    text: t("select_all"),
    cmd: "Ctrl + A",
  },
]);
// view
const itemsView = ref([
  {
    text: t("default"),
    check: currentView.value === "default",
    action: () => selectView("default"),
  },
  {
    text: t("distraction_free"),
    check: currentView.value === "distraction_free",
    action: () => selectView("distraction_free"),
  },
]);
const itemsSettings = ref([
  {
    id: "language",
    text: t("language"),
    items: [
      {
        text: t("english"),
        label: "en",
        check: currentLanguage.value === "en",
        action: () => selectLanguage("en"),
      },
      {
        text: t("french"),
        label: "fr",
        check: currentLanguage.value === "fr",
        action: () => selectLanguage("fr"),
      },
    ],
  },
  {
    id: "theme",
    text: t("theme"),
    separator: true,
    items: [
      {
        text: t("light"),
        label: "light",
        check: currentTheme.value === "light",
        action: () => selectTheme("light"),
      },
      {
        text: t("dark"),
        label: "dark",
        check: currentTheme.value === "dark",
        action: () => selectTheme("dark"),
      },
    ],
  },
  {
    id: "font",
    text: t("font"),
    items: [
      {
        text: "Inter",
        label: "Inter",
        check: currentFont.value === "Inter",
        action: () => selectFont("Inter"),
      },
      {
        text: "Roboto",
        label: "Roboto",
        check: currentFont.value === "Roboto",
        action: () => selectFont("Roboto"),
      },
      {
        text: "Space Grotesk",
        label: "Space Grotesk",
        check: currentFont.value === "Space Grotesk",
        action: () => selectFont("Space Grotesk"),
      },
    ],
  },
  {
    id: "font_size",
    text: t("font_size"),
    separator: true,
    items: [
      {
        text: "16",
        label: "16",
        check: currentFontSize.value === "16",
        action: () => selectFontSize("16"),
      },
      {
        text: "20",
        label: "20",
        check: currentFontSize.value === "20",
        action: () => selectFontSize("20"),
      },
      {
        text: "26",
        label: "26",
        check: currentFontSize.value === "26",
        action: () => selectFontSize("26"),
      },
    ],
  },
  {
    id: "reset_settings",
    text: t("reset_settings"),
    action: () => resetSettings(),
    items: [],
  },
]);
const itemsAbout = ref([
  {
    text: t("opennotedemo"),
    action: () => onSubMenuClick("opennotedemo"),
  },
  {
    text: t("website"),
    action: () => {
      const url = "https://github.com/MiKL-B/note-taking-app";
      window.open(url, "_blank");
    },
  },
  {
    text: t("developer"),
    action: () => displayAbout(),
  },
]);
const selectView = (newView: string) => {
  if (!props.distractionFree && newView === "distraction_free") {
    return;
  }
  currentView.value = newView;
  localStorage.setItem("view", currentView.value);
  emit("select-view", currentView);
  itemsView.value.forEach((item) => {
    item.check = item.text === t(newView);
  });
};
const selectLanguage = (newLanguage: string) => {
  currentLanguage.value = newLanguage;
  localStorage.setItem("language", currentLanguage.value);
  locale.value = currentLanguage.value;
  itemsSettings.value.forEach((item) => {
    item.items.forEach((i) => {
      if (item.id === "language") {
        i.check = t(i.label) === t(currentLanguage.value);
      }
    });
  });
  updateMenuItems();
};

const updateMenuItems = () => {
  // file
  itemsFile.value[0].text = t("newnote");
  itemsFile.value[1].text = t("duplicate_note");
  itemsFile.value[2].text = t("save");
  itemsFile.value[3].text = t("export");
  itemsFile.value[4].text = t("import");
  itemsFile.value[5].text = t("exit");
  // edit
  itemsEdit.value[0].text = t("undo");
  itemsEdit.value[1].text = t("redo");
  itemsEdit.value[2].text = t("cut");
  itemsEdit.value[3].text = t("ccopy");
  itemsEdit.value[4].text = t("paste");
  itemsEdit.value[5].text = t("select_all");
  // view
  itemsView.value[0].text = t("default");
  itemsView.value[1].text = t("distraction_free");
  // settings
  itemsSettings.value[0].text = t("language");
  itemsSettings.value[0].items[0].text = t("english");
  itemsSettings.value[0].items[1].text = t("french");
  itemsSettings.value[1].text = t("theme");
  itemsSettings.value[1].items[0].text = t("light");
  itemsSettings.value[1].items[1].text = t("dark");
  itemsSettings.value[2].text = t("font");
  itemsSettings.value[3].text = t("font_size");
  itemsSettings.value[4].text = t("reset_settings");
  // about
  itemsAbout.value[0].text = t("opennotedemo");
  itemsAbout.value[1].text = t("website");
  itemsAbout.value[2].text = t("developer");
};
const selectFont = (newFont: string) => {
  currentFont.value = newFont;
  localStorage.setItem("font", currentFont.value);
  const elements = document.querySelectorAll("*");
  elements.forEach((element) => {
    if (
      element.classList.contains("cm-editor") ||
      element.classList.contains("cm-scroller") ||
      element.classList.contains("cm-gutters") ||
      element.classList.contains("cm-content") ||
      element.classList.contains("v-codemirror") ||
      element.classList.contains("cm-lineNumbers") ||
      element.classList.contains("cm-gutterElement")
    ) {
      return;
    }
    let el = element as HTMLElement;
    el.style.fontFamily = currentFont.value;
  });
  itemsSettings.value.forEach((item) => {
    item.items.forEach((i) => {
      if (item.id === "font") {
        i.check = i.label === currentFont.value;
      }
    });
  });
};
const selectFontSize = (newFontSize: string) => {
  currentFontSize.value = newFontSize;
  localStorage.setItem("font-size", currentFontSize.value);
  const elements = document.querySelectorAll(".cm-content");
  elements.forEach((element) => {
    let el = element as HTMLElement;
    el.style.fontSize = currentFontSize.value + "px";
  });
  itemsSettings.value.forEach((item) => {
    item.items.forEach((i) => {
      if (item.id === "font_size") {
        i.check = i.label === currentFontSize.value;
      }
    });
  });
};
const selectTheme = (newTheme: string) => {
  currentTheme.value = newTheme;
  localStorage.setItem("theme", currentTheme.value);
  document.documentElement.setAttribute("data-theme", currentTheme.value);
  itemsSettings.value.forEach((item) => {
    item.items.forEach((i) => {
      if (item.id === "theme") {
        i.check = t(i.label) === t(currentTheme.value);
      }
    });
  });
};

const resetSettings = () => {
  selectLanguage("en");
  selectFont("Inter");
  selectFontSize("20");
  selectTheme("light");
};
</script>

<style>
#toolbar {
  border-bottom: var(--border);
  display: flex;
  padding-left: 1px;
  gap: 1rem;
  position: relative;
  background: var(--bg-toolbar);
  color: var(--text-color-toolbar);
  height: 33px;
}

.toolbar_btn {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem 0;
  border-radius: 5px;
  user-select: none;
}

.toolbar_btn:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}
</style>
