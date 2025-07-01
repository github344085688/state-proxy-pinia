import { createApp } from "vue";

import App from "./App.vue";
import pinia from '@/stores/piniaConfig'
import {status} from '@/stores/status'
import {userStore} from '@/stores/user'
import {accessEnvironmentalState} from '@/stores/units';


const app = createApp(App);
app.use(pinia);
const  Status:any = status();
app.provide("globalState", Status.state);
app.provide("globalUser", userStore() ); 
   accessEnvironmentalState(Status.state);
app.mount("#app");
