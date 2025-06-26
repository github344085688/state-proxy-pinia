 







import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import uniStorage from './uniStorage';

// 定义用户信息类型
interface UserInfo {
    name: string;
    id: number;
}

// 定义store状态类型
interface UserState {
    token: string;
    navStage: string;
    role: string;
    user: UserInfo | null;
}

export const userStore = defineStore(
    'user',
    () => {
        // 使用ref定义基础状态
        const token = ref<string>('');
        const navStage = ref<string>('');
        const role = ref<string>('');
        const user = ref<UserInfo | null>(null);
          
        return { 
            token,
            navStage,
            role,
            user 
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
            paths: ['token', 'navStage', 'role', 'user'],
        },
    },
)

