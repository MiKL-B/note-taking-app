import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import NewWindow from "../views/NewWindow.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/new-window",
      name: "NewWindow",
      component: NewWindow,
    },
  ],
});

export default router;
