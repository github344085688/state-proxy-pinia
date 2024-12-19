import { createApp } from "vue";

import App from "./App.vue";
import pinia from '@/stores/piniaConfig'
import {status} from '@/stores/status'
import {userStore} from '@/stores/user'
const app = createApp(App);
app.use(pinia);
const  Status = status();
app.provide("globalState", Status.state);
app.provide("globalUser", userStore() );
app.mount("#app");
