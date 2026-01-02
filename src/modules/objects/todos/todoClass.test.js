import { Todo } from "./todoClass";

describe("Todo Class", () => {
  describe("Constructor", () => {
    test("should create a new todo with basic properties", () => {
      const todo = new Todo("Buy groceries", "high");

      expect(todo.title).toBe("Buy groceries");
      expect(todo.priority).toBe("high");
      expect(todo.project).toBeNull();
      expect(todo.deadline).toBeNull();
      expect(todo.description).toBeNull();
      expect(todo.checklist).toBeNull();
      expect(todo.completed).toBe(false);
    });

    test("should create a todo with all parameters", () => {
      const checklist = new Map([
        ["item1", true],
        ["item2", false],
      ]);
      const todo = new Todo(
        "Complete project",
        "medium",
        "Work",
        1704067200000,
        "Finish the odin project",
        checklist
      );

      expect(todo.title).toBe("Complete project");
      expect(todo.priority).toBe("medium");
      expect(todo.project).toBe("Work");
      expect(todo.deadline).toBe(1704067200000);
      expect(todo.description).toBe("Finish the odin project");
      expect(todo.checklist).toEqual(checklist);
    });

    test("should generate a unique ID with correct prefix", () => {
      const todo = new Todo("Test", "low");
      expect(todo.id).toMatch(/^todo_/);
      expect(todo.id.length).toBeGreaterThan(5);
    });

    test("should set createdAt to current timestamp", () => {
      const beforeCreation = Date.now();
      const todo = new Todo("Test", "low");
      const afterCreation = Date.now();

      expect(todo.createdAt).toBeGreaterThanOrEqual(beforeCreation);
      expect(todo.createdAt).toBeLessThanOrEqual(afterCreation);
    });

    test("should allow using existing ID and timestamp", () => {
      const existingId = "todo_existing123";
      const existingTimestamp = 1704067200000;

      const todo = new Todo(
        "Test",
        "low",
        null,
        null,
        null,
        null,
        existingId,
        existingTimestamp
      );

      expect(todo.id).toBe(existingId);
      expect(todo.createdAt).toBe(existingTimestamp);
    });

    test("should allow setting existingCompleted flag", () => {
      const todo = new Todo(
        "Test",
        "low",
        null,
        null,
        null,
        null,
        null,
        null,
        true
      );

      expect(todo.completed).toBe(true);
    });
  });

  describe("toJSON", () => {
    test("should serialize todo to JSON object", () => {
      const todo = new Todo("Test task", "high", "Project1", 1704067200000);

      const json = todo.toJSON();

      expect(json).toEqual({
        id: todo.id,
        createdAt: todo.createdAt,
        completed: false,
        title: "Test task",
        priority: "high",
        project: "Project1",
        deadline: 1704067200000,
        description: null,
        checklist: null,
      });
    });

    test("should serialize checklist as array", () => {
      const checklist = new Map([
        ["item1", true],
        ["item2", false],
        ["item3", true],
      ]);
      const todo = new Todo("Test", "low", null, null, null, checklist);

      const json = todo.toJSON();

      expect(json.checklist).toEqual(Array.from(checklist));
      expect(Array.isArray(json.checklist)).toBe(true);
    });

    test("should serialize null checklist correctly", () => {
      const todo = new Todo("Test", "low");
      const json = todo.toJSON();

      expect(json.checklist).toBeNull();
    });
  });

  describe("fromJSON", () => {
    test("should recreate todo from JSON object", () => {
      const jsonObj = {
        id: "todo_123",
        createdAt: 1704067200000,
        completed: false,
        title: "Test task",
        priority: "high",
        project: "Project1",
        deadline: 1704067200000,
        description: "Test description",
        checklist: null,
      };

      const todo = Todo.fromJSON(jsonObj);

      expect(todo.id).toBe("todo_123");
      expect(todo.createdAt).toBe(1704067200000);
      expect(todo.completed).toBe(false);
      expect(todo.title).toBe("Test task");
      expect(todo.priority).toBe("high");
      expect(todo.project).toBe("Project1");
      expect(todo.deadline).toBe(1704067200000);
      expect(todo.description).toBe("Test description");
      expect(todo.checklist).toBeNull();
    });

    test("should restore checklist from JSON array", () => {
      const checklistArray = [
        ["item1", true],
        ["item2", false],
      ];
      const jsonObj = {
        id: "todo_123",
        createdAt: 1704067200000,
        completed: true,
        title: "Test task",
        priority: "medium",
        project: "Project1",
        deadline: 1704067200000,
        description: null,
        checklist: checklistArray,
      };

      const todo = Todo.fromJSON(jsonObj);

      expect(todo.checklist).toBeInstanceOf(Map);
      expect(todo.checklist.get("item1")).toBe(true);
      expect(todo.checklist.get("item2")).toBe(false);
    });

    test("should maintain prototype after fromJSON", () => {
      const jsonObj = {
        id: "todo_123",
        createdAt: 1704067200000,
        completed: false,
        title: "Test task",
        priority: "high",
        project: null,
        deadline: null,
        description: null,
        checklist: null,
      };

      const todo = Todo.fromJSON(jsonObj);

      expect(todo).toBeInstanceOf(Todo);
    });
  });

  describe("Serialization round-trip", () => {
    test("should survive toJSON and fromJSON cycle", () => {
      const checklist = new Map([
        ["item1", true],
        ["item2", false],
      ]);
      const originalTodo = new Todo(
        "Test task",
        "high",
        "Project1",
        1704067200000,
        "Description",
        checklist
      );

      const json = originalTodo.toJSON();
      const restoredTodo = Todo.fromJSON(json);

      expect(restoredTodo.id).toBe(originalTodo.id);
      expect(restoredTodo.createdAt).toBe(originalTodo.createdAt);
      expect(restoredTodo.completed).toBe(originalTodo.completed);
      expect(restoredTodo.title).toBe(originalTodo.title);
      expect(restoredTodo.priority).toBe(originalTodo.priority);
      expect(restoredTodo.project).toBe(originalTodo.project);
      expect(restoredTodo.deadline).toBe(originalTodo.deadline);
      expect(restoredTodo.description).toBe(originalTodo.description);
      expect(restoredTodo.checklist).toEqual(originalTodo.checklist);
    });
  });
});
