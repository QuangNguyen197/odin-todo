import { triggerCustomEvent } from "../../events/eventProducer";
import { EVENTS } from "../../events/events";

const TODO_CARD_DISPLAY = document.getElementById("todo-card-display");

export function initializeTodoCardListeners() {
  TODO_CARD_DISPLAY.addEventListener("click", (event) => {
    const card = event.target.closest("article");
    if (!card) {
      return;
    }

    const cardId = card.dataset.todoId;

    if (isChecklistItem(event.target)) {
      const parentDiv = event.target.closest("div");
      const itemId = parentDiv.dataset.itemId;
      handleChecklistClick(cardId, itemId, parentDiv);
      return;
    }

    if (event.target.tagName !== "BUTTON" && !event.target.closest("button")) {
      // Check if the visual div was clicked, and not just anywhere on the invisible article element
      if (!event.target.closest(".card-content")) {
        return;
      }

      // Open or closes the dropdown when the container is clicked
      const dropDown = card.querySelector(".extra-details");
      if (dropDown.classList.contains("open")) {
        dropDown.classList.remove("open");
      } else {
        dropDown.classList.add("open");
      }

      return;
    }

    const buttonAction = event.target.closest("button").dataset.action;

    if (buttonAction === "change-status") {
      triggerCustomEvent(document, EVENTS.TODO_STATUS_UPDATED, cardId);
    }

    if (buttonAction === "delete") {
      triggerCustomEvent(document, EVENTS.TODO_DELETE_REQUESTED, cardId);
    }

    if (buttonAction === "edit") {
      triggerCustomEvent(document, EVENTS.TODO_EDIT_REQUESTED, cardId);
    }
  });
}

function isChecklistItem(element) {
  const isInChecklist = element.closest(".todo-checklist");
  const isValidTag = element.tagName === "INPUT" || element.tagName === "LABEL";
  return isInChecklist && isValidTag;
}

function handleChecklistClick(cardId, itemId, parentContainer) {
  if (parentContainer.classList.contains("completed")) {
    return;
  }

  parentContainer.classList.add("completed");
  const identifiers = {
    todoId: cardId,
    checklistId: itemId,
  };

  triggerCustomEvent(document, EVENTS.TODO_CHECKLIST_CLICKED, identifiers);
}
