import { triggerCustomEvent } from "../../events/eventProducer";
import { EVENTS } from "../../events/events";
import { initializeTodoFormUIButtons, resetForm } from "./todoFormUIController";

export const TODO_FORM = document.getElementById("todo-form");
const TODO_DIALOG = document.getElementById("todo-dialog");

export function initializeTodoFormListeners() {
  initializeTodoFormUIButtons();

  TODO_DIALOG.addEventListener("close", () => {
    resetForm();
  });

  TODO_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    triggerCustomEvent(TODO_FORM, EVENTS.TODO_FORM_SUBMITTED, formData);
    resetForm();
    TODO_DIALOG.close();
  });
}
