import { deleteItem, saveItem } from "../storage/localStorageUtils";

export function createObjectManager() {
  /**This object manager is a general purpose utility.
   *
   * I make this factory so that I could keep track of objects
   * as is, basicalaly "in-memory" so they persist rather than
   * needing to do constant I/O read operations with JSON data from
   * local storage.
   *
   * Objects are stored in a map for faster retrieval, and can be mutated.
   */
  const storedObjects = new Map();

  function addObject(key, object) {
    storedObjects.set(key.trim(), object);
    saveItem(key, object);
    return storedObjects;
  }

  function getAllObjects() {
    return Array.from(storedObjects.values());
  }

  function getObject(key) {
    return storedObjects.get(key);
  }

  function deleteObject(key) {
    storedObjects.delete(key);
    deleteItem(key);
    return storedObjects;
  }

  return { addObject, getAllObjects, getObject, deleteObject };
}
