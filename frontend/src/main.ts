import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./styles/base.css";

const appTitle = import.meta.env.VITE_APP_TITLE ?? "CMS Starter Dashboard";
document.title = appTitle;

createApp(App).use(router).mount("#app");
