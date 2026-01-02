import { triggerCustomEvent } from "../../events/eventProducer";
import { EVENTS } from "../../events/events";
import { TODO_FORM } from "../../forms/todoForm/todoFormController";

import { Todo } from "../../objects/todos/todoClass";
import {
  createTodoFromFormData,
  createTodoFromLocalStorage,
} from "../../objects/todos/todoObjectController";
import { TODO_OBJECT_MANAGER } from "../../objects/todos/todoObjectManager";
import { getAllPrefixedItems } from "../../storage/localStorageUtils";
import { isExistingTodo, projectFieldEdited } from "./todoStateUtils";

export function initializeTodoObjState() {
  loadLocalStorageToManager();
  listenForTodoSubmissionEvent();
  listenForProjectDeleteEvent();
  listenForTodoDeleteRequestEvent();
  listenForChecklistClickEvent();
  listenForTodoStatusUpdateEvent();
}

function loadLocalStorageToManager() {
  const todoObjArray = getAllPrefixedItems(Todo.ID_PREFIX);
  if (todoObjArray.length === 0) {
    console.log("No Todo objects to load to localStorage.");
  } else {
    todoObjArray.forEach((jsonTodo) => {
      const todo = createTodoFromLocalStorage(jsonTodo);
      TODO_OBJECT_MANAGER.addTodo(todo.id, todo);
    });
  }

  triggerCustomEvent(document, EVENTS.UPDATE_DISPLAY);
  return TODO_OBJECT_MANAGER.getAllTodos();
}

function listenForTodoSubmissionEvent() {
  TODO_FORM.addEventListener(EVENTS.TODO_FORM_SUBMITTED, (event) => {
    const todoObject = createTodoFromFormData(event.detail.data);
    const todoEdited = isExistingTodo(todoObject.id);
    if (todoEdited) {
      const originalTodo = TODO_OBJECT_MANAGER.getTodo(todoObject.id);
      if (
        originalTodo.project &&
        projectFieldEdited(originalTodo.id, todoObject.project)
      ) {
        const identifierIds = {
          projectId: originalTodo.project,
          todoId: todoObject.id,
        };

        triggerCustomEvent(document, EVENTS.PROJECT_UNASSIGNED, identifierIds);
      }
    }

    TODO_OBJECT_MANAGER.addTodo(todoObject.id, todoObject);
    if (todoObject.project !== null) {
      emitProjectLinkEvent(todoObject);
    }

    if (todoEdited) {
      triggerCustomEvent(document, EVENTS.TODO_OBJECT_EDITED, todoObject.id);
    } else {
      triggerCustomEvent(document, EVENTS.TODO_CREATED, todoObject.id);
    }
  });
}

function emitProjectLinkEvent(todoObject) {
  const identifierIds = {
    projectId: todoObject.project,
    todoId: todoObject.id,
  };

  triggerCustomEvent(document, EVENTS.PROJECT_ASSIGNED, identifierIds);
}

function listenForProjectDeleteEvent() {
  document.addEventListener(EVENTS.PROJECT_DELETED, (event) => {
    cascadeUnlinkTodosFromProject(event.detail.data);
  });
}

function cascadeUnlinkTodosFromProject(idArray) {
  idArray.forEach((todoId) => {
    const todo = TODO_OBJECT_MANAGER.getTodo(todoId);
    todo.project = null;
    TODO_OBJECT_MANAGER.addTodo(todo.id, todo);
    triggerCustomEvent(document, EVENTS.TODO_OBJECT_EDITED, todo.id);
  });
}

function listenForTodoDeleteRequestEvent() {
  document.addEventListener(EVENTS.TODO_DELETE_REQUESTED, (event) => {
    const todoId = event.detail.data;
    const todoObj = TODO_OBJECT_MANAGER.getTodo(todoId);

    TODO_OBJECT_MANAGER.deleteTodo(todoId);

    const todoIdAndProjectId = {
      todoId: todoId,
      projectId: todoId.project,
    };
    triggerCustomEvent(document, EVENTS.TODO_DELETED, todoIdAndProjectId);
  });
}

function listenForChecklistClickEvent() {
  document.addEventListener(EVENTS.TODO_CHECKLIST_CLICKED, (event) => {
    const { todoId, checklistId } = event.detail.data;
    const todo = TODO_OBJECT_MANAGER.getTodo(todoId);
    todo.checklist.delete(checklistId);
    TODO_OBJECT_MANAGER.addTodo(todo.id, todo);
  });
}

function listenForTodoStatusUpdateEvent() {
  document.addEventListener(EVENTS.TODO_STATUS_UPDATED, (event) => {
    const todoId = event.detail.data;
    const todoObj = TODO_OBJECT_MANAGER.getTodo(todoId);

    todoObj.completed = !todoObj.completed;
    TODO_OBJECT_MANAGER.addTodo(todoObj.id, todoObj);

    if (todoObj.project !== null) {
      triggerCustomEvent(document, EVENTS.PROJECT_SET_MUTATED, todoObj.project);
    }

    triggerCustomEvent(document, EVENTS.TODO_OBJECT_EDITED, todoId);
  });
}
