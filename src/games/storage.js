// Safe localStorage adapter with fallback for Safari Private Browsing & strict modes
import { SyncManager } from '../services/syncManager.js';

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
  
  // If it's a high score update, trigger sync
  if (key.includes('highscore_') && num > getStorageNumber(key)) {
    SyncManager.pushScore(key, num);
  }

  memoryCache.set(key, num);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, String(num));
    }
  } catch (e) {}
}
