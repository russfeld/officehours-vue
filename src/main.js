import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Add Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// Add Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faArrowRightToBracket)

const app = createApp(App);

app.use(router);

// Add Font Awesome
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount("#app");
