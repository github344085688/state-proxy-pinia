# juejin-state

## Overview

This component is a dynamic, It is built with **Vue 3**, **Vite**, **TypeScript**,**pinia**, and **TypeScript**. Permanent storage  
 
```bash
npm install juejin-state
```
 
## in Vue main.ts:

```bash
 

 
import pinia,{status,userStore,accessEnvironmentalState} from 'juejin-state'
 
app.use(pinia);
const state = status();
app.provide("globalState", state.state );
accessEnvironmentalState( state.state);
app.mount("#app");

```
*  accessEnvironmentalState()  获取环境变量状态
*  userStore:{   token: "",   user: {}   } 用户信息存储
*  status{   status:{UNI_PLATFORM:"h5",VUE_APP_ENV:"dev"}   } 状态管理

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
onMounted(() => {
  glstate.variable =0 // 
});
</script>

```
 


```
