// Safe localStorage adapter with fallback for Safari Private Browsing & strict modes
const memoryCache = new Map();

export function getStorageNumber(key, fallback = 0) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) {
        const num = Number(val);
        return isNaN(num) ? fallback : num;
      }
    }
  } catch (e) {}
  return memoryCache.has(key) ? memoryCache.get(key) : fallback;
}

export function setStorageNumber(key, value) {
  const num = Number(value) || 0;
  memoryCache.set(key, num);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, String(num));
    }
  } catch (e) {}
}
