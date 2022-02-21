/*
 * @Author: Lance Ma
 * @Date: 2019-12-06 21:25:01
 * @LastEditTime: 2021-04-26 18:06:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: .\store\storage.js
 */

class Storage {
  constructor (parms) {
    this.storage = wx
    this.DateNow = Date.now()
    this.key = parms.key
  }
  /**
   * 获取缓存
   * @param String $key  key
   * @return value;
   */
  get (key) {
    const storage = this.storage,
          timeout = parseInt(storage.getStorageSync(`LanceMa__separator__${key}`) || 0)
    // 过期失效 验证
    if (timeout) {
      if (this.DateNow > timeout) {
          return this.remove(key)
      }
    }
    const value = storage.getStorageSync(key)
    return value ? value : undefined
  }

  /**
   * 设置缓存
   * @param String $key       key
   * @param String $value     value（支持字符串、json、数组、boolean等）
   * @param Number $timeout   过期时间（单位：秒）不设置时间即为永久保存
   * @return value;
   */
  set (key, value, timeout = 0) {
    const storage = this.storage,
          _timeout = parseInt(timeout)
    storage.setStorageSync(key, value)
    if (_timeout) {
        storage.setStorageSync(`LanceMa__separator__${key}`, this.DateNow + 1000 * 60 * 60 * _timeout)
    } else {
        storage.removeStorageSync(`LanceMa__separator__${key}`)
    }
    return value
  }

  remove (key) {
    const storage = this.storage
    storage.removeStorageSync(key)
    storage.removeStorageSync(`LanceMa__separator__${key}`)
    // return undefined
    return true
  }
}

const storageSync = new Storage({
  key: null
})

export default storageSync
