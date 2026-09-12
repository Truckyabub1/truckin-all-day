// Local storage persistence helper for Android PWA
export function getStorageNumber(key, defaultValue = 0) {
  try {
    const val = localStorage.getItem(`truckin_${key}`);
    return val !== null ? Number(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function setStorageNumber(key, value) {
  try {
    localStorage.setItem(`truckin_${key}`, String(value));
  } catch (e) {}
}

export function getStorageJson(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(`truckin_${key}`);
    return val !== null ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function setStorageJson(key, value) {
  try {
    localStorage.setItem(`truckin_${key}`, JSON.stringify(value));
  } catch (e) {}
}
