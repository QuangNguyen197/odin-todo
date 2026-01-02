import { EVENTS } from "../../events/events";
import { PROJECT_OBJECT_MANAGER } from "../../objects/projects/projectObjectManager";
import { TODO_OBJECT_MANAGER } from "../../objects/todos/todoObjectManager";
import { addSelectOption, clearParentContainer } from "../formUIUtils";
import {
  addStep,
  clearChecklistContainer,
  deleteStep,
} from "./checklistManager";

const TODO_FORM = document.getElementById("todo-form");

const ADD_TODO_BTN = document.getElementById("add-todo");
const TODO_DIALOG = document.getElementById("todo-dialog");
const FORM_BUTTONS = document.getElementById("form-control-btns");

const CHECKLIST_CONTAINER = document.getElementById("checklist-container");
const CHECKLIST_INPUT_CONTAINER = document.getElementById(
  "checklist-input-container"
);
const CHECKLIST_TEMPLATE = document.getElementById("checklist-template");

export function initializeTodoFormUIButtons() {
  ADD_TODO_BTN.addEventListener("click", () => {
    resetForm();
    renderProjectOptions();
    TODO_DIALOG.showModal();
  });

  FORM_BUTTONS.addEventListener("click", (event) => {
    const controlBtn = event.target.dataset.action;

    if (controlBtn === "reset") {
      resetForm();
    }

    if (controlBtn === "cancel") {
      resetForm();
      TODO_DIALOG.close();
    }
  });

  CHECKLIST_CONTAINER.addEventListener("click", (event) => {
    if (event.target.type !== "button") {
      return;
    }

    const clickedAction = event.target.dataset.action;

    if (clickedAction === "add-step") {
      const checklist_template = document.getElementById("checklist-template");
      addStep(CHECKLIST_INPUT_CONTAINER, checklist_template);
    }

    if (clickedAction === "delete") {
      const stepDivContainer = event.target.parentElement;
      deleteStep(stepDivContainer);
    }
  });

  document.addEventListener(EVENTS.TODO_EDIT_REQUESTED, (event) => {
    const todoId = event.detail.data;
    const todoObj = TODO_OBJECT_MANAGER.getTodo(todoId);

    resetForm();
    renderProjectOptions();
    populateFormForEdit(todoObj);
    TODO_DIALOG.showModal();
  });
}

export function resetForm() {
  clearChecklistContainer(CHECKLIST_INPUT_CONTAINER);

  TODO_FORM.querySelector("#todo-id").value = "";
  TODO_FORM.querySelector("#created-at").value = "";
  TODO_FORM.querySelector("#completed").value = "";

  TODO_FORM.reset();
}

function renderProjectOptions() {
  const selectElement = document.getElementById("projects-dropdown");
  clearParentContainer(selectElement);

  // Adds a default option
  addSelectOption(selectElement, "", "None");

  const projectsArray = PROJECT_OBJECT_MANAGER.getAllProjects();
  projectsArray.forEach((project) =>
    addSelectOption(selectElement, project.id, project.name)
  );

  return selectElement;
}

function populateFormForEdit(todo) {
  // Populate hidden fields for edit mode
  TODO_FORM.querySelector("#todo-id").value = todo.id;
  TODO_FORM.querySelector("#created-at").value = todo.createdAt;
  TODO_FORM.querySelector("#completed").value = todo.completed;

  // The rest are visible fields

  // Mandatory fields that are expected to always have a value
  TODO_FORM.querySelector("#title").value = todo.title;
  TODO_FORM.querySelector("#priority").value = todo.priority;

  //Optional field population, which could potentially be blank
  TODO_FORM.querySelector("#projects-dropdown").value = todo.project || "";
  TODO_FORM.querySelector("#deadline").value =
    todo.deadline?.substring(0, 10) || "";
  TODO_FORM.querySelector("#description").value = todo.description || "";

  if (todo.checklist) {
    for (const value of todo.checklist.values()) {
      const step = addStep(CHECKLIST_INPUT_CONTAINER, CHECKLIST_TEMPLATE);
      step.querySelector("input").value = value;
    }
  }
}
