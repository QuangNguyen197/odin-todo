import { Todo } from "./todoClass";

export function createTodoFromFormData(formData) {
  const title = formData.get("title").trim();
  const priority = formData.get("priority").trim();
  const project = formData.get("projects")?.trim() || null;

  // Convert date string to local midnight, then to ISO
  // This prevents off-by-one errors when using Date() from different timezones
  const deadlineInput = formData.get("deadline")?.trim() || null;
  const deadline = deadlineInput
    ? new Date(deadlineInput + "T00:00:00").toISOString()
    : null;

  const description = formData.get("description")?.trim() || null;

  /**If there are no checklist items, then checklist will remain as null.
   * If there are any checklist items, then I iterate through each entry and trim the strings
   * before assigning them to checklist.
   *
   * This way the checklist property is assigned null on the object rather than as an empty
   * array.
   */
  const checklistItems = Array.from(formData.getAll("checklistItem"));
  let checklist = null;
  if (checklistItems.length > 0) {
    checklist = new Map();
    checklistItems.forEach((item) => {
      const itemId = `checklist_${crypto.randomUUID()}`;
      checklist.set(itemId, item.trim());
    });
  }

  const todoId = formData.get("todo-id") || null;
  const createdAt = formData.get("created-at") || null;

  /**The object.completed property always has a value: true or false.
   * Instead of checking if this field is empty like the other two, I instead check
   * if it has been marked as a completed object.
   */
  const completed = formData.get("completed") === "true";
  return new Todo(
    title,
    priority,
    project,
    deadline,
    description,
    checklist,
    todoId,
    createdAt,
    completed
  );
}

export function createTodoFromLocalStorage(jsonObj) {
  return Todo.fromJSON(jsonObj);
}
