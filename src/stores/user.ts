import { defineStore } from 'pinia'
import {reactive, type Ref, ref} from 'vue'
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
      storage: localStorage,
      pick: ['token', 'user' ]
    }
  }
)
