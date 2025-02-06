import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SettingsWindow from "../views/SettingsWindow.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/settings-window",
      name: "SettingsWindow",
      component: SettingsWindow,
    },
  ],
});

export default router;
