import { triggerCustomEvent } from "../../events/eventProducer";
import { EVENTS } from "../../events/events";

const ADD_PROJECT_BTN = document.getElementById("add-project-btn");
const PROJECT_DIALOG = document.getElementById("project-dialog");

export const PROJECT_FORM = document.getElementById("project-form");

export function initializeProjectFormListeners() {
  ADD_PROJECT_BTN.addEventListener("click", () => {
    PROJECT_DIALOG.showModal();
  });

  PROJECT_FORM.addEventListener("click", (event) => {
    if (event.target.dataset.action === "cancel") {
      PROJECT_FORM.reset();
      PROJECT_DIALOG.close();
    }
  });

  PROJECT_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    triggerCustomEvent(PROJECT_FORM, EVENTS.PROJECT_FORM_SUBMITTED, formData);
    PROJECT_FORM.reset();
    PROJECT_DIALOG.close();
  });
}
