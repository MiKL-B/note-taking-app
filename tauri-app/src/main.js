import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";

const messages = {
  en: {
    // titlebar
    appnotes: "Taking-note App",
    // statusbar
    characters: "Characters",
    // toolbar
    language: "Language",
    theme: "Theme",
    file: "File",
    new: "New",
    open: "Open",
    save: "Save",
    exportaspdf: "Export as PDF",
    print: "Print...",
    exit: "Quit",
    edit: "Edit",
    undo: "Undo",
    redo: "Redo",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    view: "View",
    sidebar: "Sidebar",
    notelist: "Notelist",
    notebar: "Notebar",
    settings: "Settings",
    markdown: "Markdown",
    about: "About...",
    // sidebar
    allnotes: "All notes",
    todo: "To do",
    inprogress: "In progress",
    finished: "Finished",
    archived: "Archived",
    // notelist,
    create_first_note: "Create your first note!",
    filter_note_by_name: "Filter notes by name...",
    // notebar
    font: "Font",
    font_size: "Font size",
    // note
    note_name_here: "Note name here...",
    status: "Status",
    enter_text_here: "Enter text here...",
  },
  fr: {
    // titlebar
    appnotes: "Application de prise de note",
    // statusbar
    characters: "Caractères",
    // toolbar
    language: "Langue",
    theme: "Thème",
    file: "Fichier",
    new: "Nouveau",
    open: "Ouvrir",
    save: "Enregistrer",
    exportaspdf: "Exporter au format PDF",
    print: "Imprimer...",
    exit: "Quitter",
    edit: "Edition",
    undo: "Annuler",
    redo: "Refaire",
    cut: "Couper",
    copy: "Copier",
    paste: "Coller",
    view: "Affichage",
    sidebar: "Barre latérale",
    notelist: "Liste de notes",
    notebar: "Barre d'outils note",
    settings: "Paramètres",
    markdown: "Markdown",
    about: "À propos...",
    // sidebar
    allnotes: "Notes",
    todo: "À faire",
    inprogress: "En cours",
    finished: "Complétées",
    archived: "Archivées",
    // notelist,
    create_first_note: "Creer votre première note!",
    filter_note_by_name: "Filtrer les notes par nom...",
    // notebar
    font: "Police",
    font_size: "Taille de la police",
    // note
    note_name_here: "Nom de la note ici...",
    status: "Statut",
    enter_text_here: "Entrer le texte ici...",
  },
};
const i18n = createI18n({
  locale: "en",
  messages,
});
const app = createApp(App);

app.use(i18n);
app.mount("#app");
