import {defineStore} from 'pinia'
import {ref,reactive} from 'vue'
export const status = defineStore(
    'status',
    (item:any) => {
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

