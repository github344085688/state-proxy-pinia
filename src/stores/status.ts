import {defineStore} from 'pinia'
import {reactive} from 'vue'
import uniStorage from './uniStorage';
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
            storage: {
                setItem(key, value) {
                    uniStorage.set(key, value)
                },
                getItem(key) {

                    return uniStorage.get(key)
                },
            },
            paths: ['state'],
        },
    },
)

