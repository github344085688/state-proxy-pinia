import { defineStore } from 'pinia'
import {reactive, type Ref, ref} from 'vue'
import uniStorage from "./uniStorage";
// 定义 Store
export const userStore = defineStore(
  'user',
  () => {
      const token: Ref<string> = ref('')
    const user = reactive({} );
    return {
      token,
      user,
    }
  },
  {
    persist: {
        storage: {
            setItem(key, value) {
                uniStorage.set(key, value)
            },
            getItem(key) {
                return uniStorage.get(key)
            },
        },
        paths: ['token', 'user' ]
    }
  }
)
