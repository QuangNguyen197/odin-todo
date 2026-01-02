import { triggerCustomEvent } from "../../events/eventProducer";
import { EVENTS } from "../../events/events";
import {
  getFilterState,
  resetFilterStateToDefault,
} from "../../state/filterState/filterStateController";

const PROJECT_TAB_TEMPLATE = document.getElementById("project-tab-template");
export const PROJECT_LIST = document.getElementById("projects-list");

export function initializeProjectTabListeners() {
  PROJECT_LIST.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") {
      return null;
    }

    const buttonAction = event.target.dataset.action;
    const projectId = event.target.dataset.projectId;

    if (buttonAction === "delete") {
      /**If we are deleting the project we are currently filtering by,
       * then we need to reset the filterState() back to a default value,
       * otherwise it will try to filter the UI by a condition that no longer exists.
       *
       * We also need to refresh the display so it resets back to the default filter.
       */
      const { display } = getFilterState();
      const isDeletingActiveFilter = display === projectId;

      event.target.parentElement.remove();
      triggerCustomEvent(
        PROJECT_LIST,
        EVENTS.PROJECT_DELETE_REQUESTED,
        projectId
      );

      if (isDeletingActiveFilter) {
        resetFilterStateToDefault();
        triggerCustomEvent(document, EVENTS.UPDATE_DISPLAY);
      }
    }
  });
}

/**
 * Renders all existing projects into the sidebar.
 *
 * This function is called upon page load, refresh, or display update events.
 * All project tabs are removed, sorted alphabetically, and then rendered in a loop.
 *
 * @param {Array<Object>} projectsArray - An array containing all existing Project Objects.
 */
export function renderProjectTabs(projectsArray) {
  PROJECT_LIST.replaceChildren();

  // Sorts projects by name, in alphabetical order
  const sortedProjects = [...projectsArray].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  sortedProjects.forEach((project) => {
    const newTab = createProjectTab(project);
    PROJECT_LIST.appendChild(newTab);
  });
}

/**
 * Creates and appends new project tabs to the sidebar.
 *
 * @param {Object} projectObj - A Project Object
 */
export function appendNewProject(projectObj) {
  const newTab = createProjectTab(projectObj);
  PROJECT_LIST.appendChild(newTab);
}

/**
 * Selects a project tab element that matches the passed ID and removes it from the DOM.
 * Returns if the element could not be found.
 *
 * @param {String} projectId - The unique ID of a project.
 * @returns
 */
export function removeProjectTab(projectId) {
  const selector = `[data-project-id="${projectId}"]`;
  const projectTab = PROJECT_LIST.querySelector(selector);

  if (!projectTab) {
    return;
  }
  projectTab.remove();
}

/**
 * Updates the visual counter that is display alongside a Project tab's name to
 * show how many elements are linked to the project.
 *
 * @param {String} projectId - The unique ID of project.
 * @param {Int} linkedTodosLength - The length of the Set() that stores linked todos.
 */
export function updateTodoCounter(projectId, linkedTodosLength) {
  const selector = `[data-project-id="${projectId}"]`;
  const projectTab = PROJECT_LIST.querySelector(selector);

  const todoCounter = projectTab.querySelector(".todo-counter");
  todoCounter.textContent = linkedTodosLength;
}

/**
 * Creates a project tab that represents the internal object
 *
 * @param {Object} project - A Project Object
 * @returns {DocumentFragment} Populated tab template
 */
function createProjectTab(project) {
  const clonedTemplate = PROJECT_TAB_TEMPLATE.content.cloneNode(true);
  const tabButton = clonedTemplate.querySelector(".project-btn");
  const deleteButton = clonedTemplate.querySelector(".delete-project-btn");
  const projectName = clonedTemplate.querySelector(".project-name");
  const todoCounter = clonedTemplate.querySelector(".todo-counter");

  tabButton.dataset.projectId = project.id;

  projectName.textContent = project.name;
  todoCounter.textContent = project.linkedIds.size;

  deleteButton.dataset.projectId = project.id;

  return clonedTemplate;
}
