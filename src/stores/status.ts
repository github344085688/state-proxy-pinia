import {defineStore} from 'pinia'
import {reactive} from 'vue'
export const status = defineStore(
    'status',
    () => {
      const state = reactive({} );
        return {
            state
        }
    },
    {
        persist: {
          storage: localStorage,
          pick: ['state'],
        },
    },
)

