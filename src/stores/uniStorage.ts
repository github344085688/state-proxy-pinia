declare const uni: any;
const uniStorage = {
  /**
   * 设置永久缓存
   * @param key 缓存键
   * @param value 缓存值
   */
  set(key: string, value: any): void {
    if (typeof uni !== 'undefined') uni.setStorageSync(key, value)
    else localStorage.setItem(key,  value )

  },

  /**
   * 获取永久缓存
   * @param key 缓存键
   * @returns 缓存值
   */
  get(key: string): any {
    // alert('1')
    if (typeof uni !== 'undefined')  return uni.getStorageSync(key)
    else return localStorage.getItem(key)

  },

  /**
   * 移除永久缓存
   * @param key 缓存键
   */
  delete(key: string): void {
    if (typeof uni !== 'undefined') uni.removeStorageSync(key)
    else return localStorage.removeItem( key)

  },

  /**
   * 移除全部永久缓存
   */
  clear(): void {
    if (typeof uni !== 'undefined')  uni.clearStorageSync()
    else return localStorage.clear()

  },
}

export default uniStorage
