import { Project } from "./projectClass";

describe("Project Class", () => {
  describe("Constructor", () => {
    test("should create a new project with name only", () => {
      const project = new Project("My Project");

      expect(project.name).toBe("My Project");
      expect(project.linkedIds).toBeInstanceOf(Set);
      expect(project.linkedIds.size).toBe(0);
    });

    test("should generate a unique ID with correct prefix", () => {
      const project = new Project("Test Project");

      expect(project.id).toMatch(/^project_/);
      expect(project.id.length).toBeGreaterThan(8);
    });

    test("should create project with existing linkedIds", () => {
      const linkedIds = new Set(["todo_1", "todo_2", "todo_3"]);
      const project = new Project("My Project", linkedIds);

      expect(project.linkedIds).toEqual(linkedIds);
      expect(project.linkedIds.size).toBe(3);
    });

    test("should throw error if linkedIds is not a Set", () => {
      expect(() => {
        new Project("My Project", ["todo_1", "todo_2"]);
      }).toThrow("linkedIds must be a Set");
    });

    test("should throw error if linkedIds is an array", () => {
      expect(() => {
        new Project("My Project", []);
      }).toThrow("linkedIds must be a Set");
    });

    test("should throw error if linkedIds is an object", () => {
      expect(() => {
        new Project("My Project", {});
      }).toThrow("linkedIds must be a Set");
    });

    test("should generate different IDs for different projects", () => {
      const project1 = new Project("Project 1");
      const project2 = new Project("Project 2");

      expect(project1.id).not.toBe(project2.id);
    });
  });

  describe("addLinkedId", () => {
    test("should add a single ID to linkedIds", () => {
      const project = new Project("My Project");

      project.addLinkedId("todo_1");

      expect(project.linkedIds.has("todo_1")).toBe(true);
      expect(project.linkedIds.size).toBe(1);
    });

    test("should add multiple IDs", () => {
      const project = new Project("My Project");

      project.addLinkedId("todo_1");
      project.addLinkedId("todo_2");
      project.addLinkedId("todo_3");

      expect(project.linkedIds.size).toBe(3);
      expect(project.linkedIds.has("todo_1")).toBe(true);
      expect(project.linkedIds.has("todo_2")).toBe(true);
      expect(project.linkedIds.has("todo_3")).toBe(true);
    });

    test("should not add duplicate IDs", () => {
      const project = new Project("My Project");

      project.addLinkedId("todo_1");
      project.addLinkedId("todo_1");

      expect(project.linkedIds.size).toBe(1);
    });
  });

  describe("removeLinkedId", () => {
    test("should remove an ID from linkedIds", () => {
      const project = new Project("My Project");
      project.addLinkedId("todo_1");
      project.addLinkedId("todo_2");

      project.removeLinkedId("todo_1");

      expect(project.linkedIds.has("todo_1")).toBe(false);
      expect(project.linkedIds.has("todo_2")).toBe(true);
      expect(project.linkedIds.size).toBe(1);
    });

    test("should handle removing non-existent ID", () => {
      const project = new Project("My Project");
      project.addLinkedId("todo_1");

      // Should not throw error
      project.removeLinkedId("todo_nonexistent");

      expect(project.linkedIds.size).toBe(1);
      expect(project.linkedIds.has("todo_1")).toBe(true);
    });

    test("should remove all IDs one by one", () => {
      const project = new Project("My Project");
      project.addLinkedId("todo_1");
      project.addLinkedId("todo_2");
      project.addLinkedId("todo_3");

      project.removeLinkedId("todo_1");
      project.removeLinkedId("todo_2");
      project.removeLinkedId("todo_3");

      expect(project.linkedIds.size).toBe(0);
    });
  });

  describe("toJSON", () => {
    test("should serialize project to JSON object", () => {
      const project = new Project("My Project");

      const json = project.toJSON();

      expect(json).toEqual({
        id: project.id,
        name: "My Project",
        linkedIds: [],
      });
    });

    test("should serialize linkedIds as array", () => {
      const linkedIds = new Set(["todo_1", "todo_2", "todo_3"]);
      const project = new Project("My Project", linkedIds);

      const json = project.toJSON();

      expect(Array.isArray(json.linkedIds)).toBe(true);
      expect(json.linkedIds).toContain("todo_1");
      expect(json.linkedIds).toContain("todo_2");
      expect(json.linkedIds).toContain("todo_3");
      expect(json.linkedIds.length).toBe(3);
    });

    test("should serialize project with added IDs", () => {
      const project = new Project("My Project");
      project.addLinkedId("todo_1");
      project.addLinkedId("todo_2");

      const json = project.toJSON();

      expect(json.linkedIds.length).toBe(2);
      expect(json.linkedIds).toContain("todo_1");
      expect(json.linkedIds).toContain("todo_2");
    });
  });

  describe("fromJSON", () => {
    test("should recreate project from JSON object", () => {
      const jsonObj = {
        id: "project_123",
        name: "My Project",
        linkedIds: ["todo_1", "todo_2"],
      };

      const project = Project.fromJSON(jsonObj);

      expect(project.id).toBe("project_123");
      expect(project.name).toBe("My Project");
      expect(project.linkedIds).toBeInstanceOf(Set);
      expect(project.linkedIds.size).toBe(2);
      expect(project.linkedIds.has("todo_1")).toBe(true);
      expect(project.linkedIds.has("todo_2")).toBe(true);
    });

    test("should recreate project with empty linkedIds", () => {
      const jsonObj = {
        id: "project_123",
        name: "Empty Project",
        linkedIds: [],
      };

      const project = Project.fromJSON(jsonObj);

      expect(project.linkedIds.size).toBe(0);
    });

    test("should maintain prototype after fromJSON", () => {
      const jsonObj = {
        id: "project_123",
        name: "My Project",
        linkedIds: ["todo_1"],
      };

      const project = Project.fromJSON(jsonObj);

      expect(project).toBeInstanceOf(Project);
    });

    test("should allow adding IDs after fromJSON", () => {
      const jsonObj = {
        id: "project_123",
        name: "My Project",
        linkedIds: ["todo_1"],
      };

      const project = Project.fromJSON(jsonObj);
      project.addLinkedId("todo_2");

      expect(project.linkedIds.size).toBe(2);
      expect(project.linkedIds.has("todo_2")).toBe(true);
    });
  });

  describe("Serialization round-trip", () => {
    test("should survive toJSON and fromJSON cycle", () => {
      const linkedIds = new Set(["todo_1", "todo_2", "todo_3"]);
      const originalProject = new Project("My Project", linkedIds);

      const json = originalProject.toJSON();
      const restoredProject = Project.fromJSON(json);

      expect(restoredProject.id).toBe(originalProject.id);
      expect(restoredProject.name).toBe(originalProject.name);
      expect(restoredProject.linkedIds).toEqual(originalProject.linkedIds);
    });

    test("should survive multiple operations and serialization", () => {
      const linkedIds = new Set(["todo_1"]);
      const originalProject = new Project("My Project", linkedIds);

      originalProject.addLinkedId("todo_2");
      originalProject.addLinkedId("todo_3");
      originalProject.removeLinkedId("todo_1");

      const json = originalProject.toJSON();
      const restoredProject = Project.fromJSON(json);

      expect(restoredProject.linkedIds.has("todo_1")).toBe(false);
      expect(restoredProject.linkedIds.has("todo_2")).toBe(true);
      expect(restoredProject.linkedIds.has("todo_3")).toBe(true);
      expect(restoredProject.linkedIds.size).toBe(2);
    });
  });
});
