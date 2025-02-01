import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";

const messages = {
  en: {
    appnotes: "Taking-note App",
    characters: "Characters",
    language: "Language",
    theme: "Theme",
    file: "File",
    new: "New",
    open: "Open",
    save: "Save",
    exportaspdf: "Export as PDF",
    print: "Print...",
    exit: "Quit",
    edit:"Edit",
    undo:"Undo",
    redo:"Redo",
    cut:"Cut",
    copy:"Copy",
    paste:"Paste",
    view:"View",
    sidebar:"Sidebar",
    notelist:"Notelist",
    notebar:"Notebar",
    settings:"Settings",
    markdown:"Markdown",
    about:"About..."
  },
  fr: {
    appnotes: "Application de prise de note",
    characters: "Caractères",
    language: "Langue",
    theme: "Thème",
    file: "Fichier",
    new: "Nouveau",
    open: "Ouvrir",
    save: "Enregistrer",
    exportaspdf: "Exporter au format PDF",
    print: "Imprimer...",
    exit: "Quitter",
    edit:"Edition",
    undo:"Annuler",
    redo:"Refaire",
    cut:"Couper",
    copy:"Copier",
    paste:"Coller",
    view:"Affichage",
    sidebar:"Barre latérale",
    notelist:"Liste de notes",
    notebar:"Barre d'outils note",
    settings:"Paramètres",
    markdown:"Markdown",
    about:"À propos..."

  },
};
const i18n = createI18n({
  locale: "en",
  messages,
});
const app = createApp(App);

app.use(i18n);
app.mount("#app");
