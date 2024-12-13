# state-proxy-pinia

## Overview

This component is a dynamic, It is built with **Vue 3**, **Vite**, **TypeScript**,**pinia**, and **TypeScript**. Permanent storage  
 
```bash
npm install v-table-system
```
 
## in Vue main.ts:

```bash
import App from "./App.vue";
import pinia,{globalState} from 'state-proxy-pinia'
const app: any = createApp(App);
app.use(pinia);
const state = globalState();
app.provide("globalState", state.state );
app.mount("#app");
```

## in Vue Script:

```bash
<template>
  <div class=""> {{ glstate?.variable }} </div>
  <div >
       <button @click="glstate.variable ++"   >
        Primary
      </button>
  </div>

</template>
<script setup lang="ts"> 
import {onMounted,inject} from "vue";
const glstate:any = inject("globalState"); 
</script>

```
 


```
