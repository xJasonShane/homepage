/**
 * 本地存储缓存工具类
 * 提供带过期时间的 localStorage 缓存功能
 */
class LocalStorageCache {
  /**
   * 构造函数
   * @param {string} cacheKey - 缓存键名
   * @param {number} duration - 缓存时长（毫秒）
   */
  constructor(cacheKey, duration) {
    this.cacheKey = cacheKey;
    this.duration = duration;
  }

  /**
   * 获取缓存数据
   * @returns {any|null} 缓存的数据，如果过期或不存在则返回 null
   */
  get() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // 检查是否过期
        if (Date.now() - timestamp < this.duration) {
          return data;
        }
      }
    } catch (error) {
      console.warn(`读取缓存失败 [${this.cacheKey}]:`, error);
    }
    return null;
  }

  /**
   * 设置缓存数据
   * @param {any} data - 要缓存的数据
   * @returns {boolean} 是否设置成功
   */
  set(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.warn(`写入缓存失败 [${this.cacheKey}]:`, error);
      return false;
    }
  }

  /**
   * 清除缓存
   * @returns {boolean} 是否清除成功
   */
  clear() {
    try {
      localStorage.removeItem(this.cacheKey);
      return true;
    } catch (error) {
      console.warn(`清除缓存失败 [${this.cacheKey}]:`, error);
      return false;
    }
  }
}

export default LocalStorageCache;
