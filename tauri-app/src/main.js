import "./style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from './router'
import messages from "./messages";

const pinia = createPinia();
const i18n = createI18n({
  locale: "en",
  messages,
});
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);

app.mount("#app");
