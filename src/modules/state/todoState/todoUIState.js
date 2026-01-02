import { EVENTS } from "../../events/events";
import { PROJECT_OBJECT_MANAGER } from "../../objects/projects/projectObjectManager";
import { TODO_OBJECT_MANAGER } from "../../objects/todos/todoObjectManager";
import { updateTodoCounter } from "../../ui/generalTabs/generalTabsController";
import {
  appendNewCard,
  removeTodoCard,
  renderTodoCards,
  updateExistingCard,
} from "../../ui/todos/renderTodoCards";
import { initializeTodoCardListeners } from "../../ui/todos/todoCardController";
import {
  getFilterState,
  resetFilterStateToDefault,
} from "../filterState/filterStateController";
import {
  enrichTodos,
  filterActiveTodos,
  filterCompletedTodos,
  filterTodosByDate,
  shouldDisplayTodo,
} from "./todoStateUtils";

export function initializeTodoUIState() {
  listenForDisplayUpdates();
  listenForCounterUpdates();
  initializeTodoCardListeners();
}

/**Renders Todo Objects to the display depending on the last filter condition.
 *
 * Retrieves the last filter state from getFilterState(), and then parses the Project and Todo object managers
 * depending on the type of filter, and the display condition.
 */
export function renderAllTodos() {
  const { type, display } = getFilterState();
  if (type === "general") {
    let rawTodos;

    if (display === "completed") {
      rawTodos = filterCompletedTodos(TODO_OBJECT_MANAGER.getAllTodos());
    } else {

    /**I remove any todos that have been marked as completed from the array before
     * displaying them to the screen, showing only incomplete todos.
     */
      rawTodos = filterActiveTodos(
        filterTodosByDate(TODO_OBJECT_MANAGER.getAllTodos(), display)
      );
    }

    const enrichedTodos = enrichTodos(rawTodos);
    renderTodoCards(enrichedTodos);
  }

  if (type === "project") {
    const projectObject = PROJECT_OBJECT_MANAGER.getProject(display);
    if (!projectObject) {
      resetFilterStateToDefault();
      return renderAllTodos();
    }
    const todoIdsArray = Array.from(projectObject.linkedIds);
    const rawTodos = todoIdsArray.map((id) => TODO_OBJECT_MANAGER.getTodo(id));

    //Only display todo's not marked completed
    const activeTodos = filterActiveTodos(rawTodos);
    const enrichedTodos = enrichTodos(activeTodos);

    renderTodoCards(enrichedTodos);
  }
}

function listenForDisplayUpdates() {
  document.addEventListener(EVENTS.UPDATE_DISPLAY, () => {
    renderAllTodos();
  });

  document.addEventListener(EVENTS.TODO_OBJECT_EDITED, (event) => {
    const todoId = event.detail.data;
    const todoObject = TODO_OBJECT_MANAGER.getTodo(todoId);
    const [enrichedTodo] = enrichTodos([todoObject]);
    updateExistingCard(todoId, enrichedTodo);
  });

  document.addEventListener(EVENTS.TODO_CREATED, (event) => {
    const todoId = event.detail.data;
    const todoObject = TODO_OBJECT_MANAGER.getTodo(todoId);
    const [enrichedTodo] = enrichTodos([todoObject]);

    const filterState = getFilterState();
    if (shouldDisplayTodo(enrichedTodo, filterState)) {
      appendNewCard(enrichedTodo);
    }
  });

  document.addEventListener(EVENTS.TODO_DELETED, (event) => {
    const { todoId } = event.detail.data;
    removeTodoCard(todoId);
  });

  /**
   * I am checking to see if the card that changed or removed it's project field
   * after editing was being displayed by the current filter.
   *
   * If it was, then I want to visually remove it from the DOM as it would no longer
   * belong to that filter condition.
   */
  document.addEventListener(EVENTS.PROJECT_UNASSIGNED, (event) => {
    const { projectId, todoId } = event.detail.data;
    const { type, display } = getFilterState();

    if (type === "project" && display === projectId) {
      removeTodoCard(todoId);
    }
  });
}

/**Updates the counters beside each general tab with todos that fit their filter condition.
 */
function updateAllGeneralCounters() {
  const allTodos = TODO_OBJECT_MANAGER.getAllTodos();

  const activeTodos = filterActiveTodos(allTodos);
  updateTodoCounter("all", activeTodos.length);

  const todayTodos = filterActiveTodos(filterTodosByDate(allTodos, "today"));
  updateTodoCounter("today", todayTodos.length);

  const weekTodos = filterActiveTodos(filterTodosByDate(allTodos, "week"));
  updateTodoCounter("week", weekTodos.length);

  const overdueTodos = filterActiveTodos(
    filterTodosByDate(allTodos, "overdue")
  );
  updateTodoCounter("overdue", overdueTodos.length);

  const completedTodos = filterCompletedTodos(allTodos);
  updateTodoCounter("completed", completedTodos.length);
}

/**
 * Adds an event to each Todo mutation event to update the general tab counters,
 * similar to the project tab counters.
 */
function listenForCounterUpdates() {
  const todoMutationEvents = [
    EVENTS.UPDATE_DISPLAY,
    EVENTS.TODO_CREATED,
    EVENTS.TODO_OBJECT_EDITED,
    EVENTS.TODO_DELETED,
  ];

  todoMutationEvents.forEach((eventName) => {
    document.addEventListener(eventName, updateAllGeneralCounters);
  });
}
