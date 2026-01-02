import { storageAvailable } from "./storageAvailable";

let IS_STORAGE_AVAILABLE = null;

export function initializeStorage() {
  IS_STORAGE_AVAILABLE = storageAvailable("localStorage");

  if (!IS_STORAGE_AVAILABLE) {
    console.error(
      "localStorage is not available. Data will not persist in this session."
    );
  }

  return IS_STORAGE_AVAILABLE;
}

export function saveItem(key, item) {
  if (!IS_STORAGE_AVAILABLE) {
    return null;
  }

  try {
    localStorage.setItem(normalizeKey(key), JSON.stringify(item));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return null;
  }
}

export function deleteItem(key) {
  if (!IS_STORAGE_AVAILABLE) {
    return null;
  }
  localStorage.removeItem(normalizeKey(key));
}

export function getItem(key) {
  if (!IS_STORAGE_AVAILABLE) {
    return null;
  }

  const JSONItem = localStorage.getItem(normalizeKey(key));

  let parsedItem;
  try {
    parsedItem = JSON.parse(JSONItem);
  } catch (error) {
    console.error("Failed to parse JSON from localStorage", error);
  }

  return parsedItem;
}

export function getAllPrefixedItems(keyPefix) {
  if (!IS_STORAGE_AVAILABLE) {
    return null;
  }

  const itemsArray = [];

  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i);
    if (key.startsWith(keyPefix)) {
      itemsArray.push(getItem(key));
    }
  }

  return itemsArray;
}

function normalizeKey(key) {
  const lowerAndTrimmedKey = key.trim().toLowerCase();

  const spaceToUnderScoreRegex = /\s+/g;
  const whitespaceReplacedKey = lowerAndTrimmedKey.replace(
    spaceToUnderScoreRegex,
    "_"
  );

  const normalizedKey = whitespaceReplacedKey.normalize("NFC");
  return normalizedKey;
}
