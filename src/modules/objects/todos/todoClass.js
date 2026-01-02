export class Todo {
  static ID_PREFIX = "todo_";

  static fromJSON(jsonObj) {
    const todo = Object.create(Todo.prototype);
    todo.id = jsonObj.id;
    todo.createdAt = jsonObj.createdAt;
    todo.completed = jsonObj.completed;
    todo.title = jsonObj.title;
    todo.priority = jsonObj.priority;
    todo.project = jsonObj.project;
    todo.deadline = jsonObj.deadline;
    todo.description = jsonObj.description;
    todo.checklist = jsonObj.checklist ? new Map(jsonObj.checklist) : null;

    return todo;
  }

  /**existingId and existingTimestamp are parameters passed when an existing Object has been modified in some way directly,
   * usually by an edit form or mutating function.
   */
  constructor(
    title,
    priority,
    project = null,
    deadline = null,
    description = null,
    checklist = null,
    existingId = null,
    existingTimestamp = null,
    existingCompleted = false
  ) {
    this.id = existingId || `${Todo.ID_PREFIX}${crypto.randomUUID()}`;
    this.createdAt = existingTimestamp || Date.now();
    this.completed = existingCompleted;
    this.title = title;
    this.priority = priority;
    this.project = project;
    this.deadline = deadline;
    this.description = description;
    this.checklist = checklist;
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      completed: this.completed,
      title: this.title,
      priority: this.priority,
      project: this.project,
      deadline: this.deadline,
      description: this.description,
      checklist: this.checklist ? Array.from(this.checklist) : null,
    };
  }
}
