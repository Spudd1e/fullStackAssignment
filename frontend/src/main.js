import { createApp, provide } from "vue";
import App from "../src/views/App.vue";
import router from "./router";
import emitter from "./services/mitt";

import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";

library.add(
  faUser,
  faSearch,
  faHouse,
  faSignOut,
  faSignIn,
  faUserPlus,
  faThumbsUp,
  faSpinner,
  faUserMinus,
  faEye,
  faEyeSlash,
  faToggleOff,
  faToggleOn,
);

const app = createApp(App);
app.provide("emitter", emitter);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);

app.mount("#app");
