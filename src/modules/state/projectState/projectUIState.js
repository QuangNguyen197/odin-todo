import { EVENTS } from "../../events/events";
import { PROJECT_OBJECT_MANAGER } from "../../objects/projects/projectObjectManager";
import { TODO_OBJECT_MANAGER } from "../../objects/todos/todoObjectManager";
import {
  appendNewProject,
  initializeProjectTabListeners,
  renderProjectTabs,
  updateTodoCounter,
} from "../../ui/projects/projectsTabHandler";
import { filterActiveTodos } from "../todoState/todoStateUtils";

export function initializeProjectUIState() {
  listenForDisplayUpdates();
  initializeProjectTabListeners();
}

function listenForDisplayUpdates() {
  document.addEventListener(EVENTS.UPDATE_DISPLAY, () => {
    renderProjectTabs(PROJECT_OBJECT_MANAGER.getAllProjects());
    updateAllProjectCounters();
  });

  document.addEventListener(EVENTS.PROJECT_CREATED, (event) => {
    const projectObj = event.detail.data;
    appendNewProject(projectObj);
  });

  document.addEventListener(EVENTS.PROJECT_SET_MUTATED, (event) => {
    const projectId = event.detail.data;

    // Calculate the amount of todo's not marked completed
    const project = PROJECT_OBJECT_MANAGER.getProject(projectId);

    // Construct an array containing all the todo objects linked to the project
    const rawTodos = Array.from(project.linkedIds, (id) =>
      TODO_OBJECT_MANAGER.getTodo(id)
    );
    const activeTodos = filterActiveTodos(rawTodos);

    updateTodoCounter(projectId, activeTodos.length);
  });
}

function updateAllProjectCounters() {
  const allProjects = PROJECT_OBJECT_MANAGER.getAllProjects();

  allProjects.forEach((project) => {
    const rawTodos = Array.from(project.linkedIds, (id) =>
      TODO_OBJECT_MANAGER.getTodo(id)
    );
    const activeTodos = filterActiveTodos(rawTodos);
    updateTodoCounter(project.id, activeTodos.length);
  });
}
