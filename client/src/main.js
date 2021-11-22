import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "reset-css";
import "./assets/css/base.css";
import "./assets/css/grid.css";
import "@fontsource/roboto";
import "./assets/css/responsive.css";

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
