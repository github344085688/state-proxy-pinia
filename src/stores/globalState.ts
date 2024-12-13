
  import {status} from "./status";

function reactiveStatus<T>(target:any): T {
    if (Array.isArray(target)) {
        return createReactiveArray(target) as unknown as T;
    }
    return new Proxy(target, {
        get(target:any, key: string | symbol): any {
            const value = Reflect.get(target, key);
            if (typeof value === 'object' && value !== null) {
                return reactiveStatus(value);
            }
            return value;
        },
        set(target:any, key: string | symbol, value: any): boolean {
            if (typeof value === 'object' && value !== null) {
                value = reactiveStatus(value);
            }
            Reflect.set(target, key, value);
            return true;
        }
    }) as T;
}

function createReactiveArray<T>(target: T[]): T[] {
    return new Proxy(target, {
        get(target: T[], key: string | number | symbol): any {
            if (typeof key === 'string' && /^\d+$/.test(key)) {
                return reactiveStatus(target[key as keyof T[]]);
            }
            return Reflect.get(target, key);
        },
        set(target: T[], key: string | number | symbol, value: any): boolean {
            if (typeof key === 'string' && /^\d+$/.test(key)) {
                if (typeof value === 'object' && value !== null) {
                    value = reactiveStatus(value);
                }
                target  = value;
                return true;
            }
            return Reflect.set(target, key, value);
        },
        deleteProperty(target: T[], key: string | number | symbol): boolean {
            if (typeof key === 'string' && /^\d+$/.test(key)) {
                return Reflect.deleteProperty(target, key);
            }
            return Reflect.deleteProperty(target, key);
        },
        ownKeys(target: T[]): (string | symbol)[] {
            return Reflect.ownKeys(target).sort((a, b) => {
                const aStr = typeof a === 'string' ? a : String(a);
                const bStr = typeof b === 'string' ? b : String(b);
                const aNum = /^\d+$/.test(aStr) ? parseInt(aStr, 10) : aStr;
                const bNum = /^\d+$/.test(bStr) ? parseInt(bStr, 10) : bStr;
                if (typeof aNum === 'number' && typeof bNum === 'number') {
                    return aNum - bNum;
                }
                return aStr.localeCompare(bStr);
            }).map(key => typeof key === 'number' ? String(key): key);
        }
    }) as T[];
}

  const globalState:any =()=>{
      return   reactiveStatus(status());
  }
  export  default globalState ;