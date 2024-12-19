<template>
  <div class=""> asda {{ glstate?.aa }} </div>
  <div class="flex justify-center"><button @click="glstate.aa ++" class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
    Primary
  </button></div>

</template>
<script setup lang="ts">
import {onMounted,inject} from "vue";
const glstate:any = inject("globalState");
</script>
