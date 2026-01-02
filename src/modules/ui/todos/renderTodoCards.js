import { format } from "date-fns";

const TODO_CARD_TEMPLATE = document.getElementById("todo-card-template");
const TODO_CARD_DISPLAY = document.getElementById("todo-card-display");
const CARD_CHECKLIST_ITEM_TEMPLATE = document.getElementById(
  "card-checklist-item-template"
);

export function renderTodoCards(todoObjectArray) {
  TODO_CARD_DISPLAY.replaceChildren();

  const sortedTodoArray = [...todoObjectArray].sort(
    (a, b) => a.createdAt - b.createdAt
  );
  sortedTodoArray.forEach((todo) => {
    const todoTemplateClone = createCard(todo);
    TODO_CARD_DISPLAY.appendChild(todoTemplateClone);
  });
}

/**
 * querySelects an existing Todo Card element by using a todoId value.
 * The selected element is updated in place rather.
 *
 * @param {string} todoId - The unique ID value from a todo object
 */
export function updateExistingCard(todoId, todoObject) {
  const selector = `[data-todo-id="${todoId}"]`;
  const todoCard = TODO_CARD_DISPLAY.querySelector(selector);
  if (!todoCard) {
    return;
  }

  const wasOpen = todoCard
    .querySelector(".extra-details")
    .classList.contains("open");

  const newCard = createCard(todoObject);
  if (wasOpen) {
    const extraDetails = newCard.querySelector(".extra-details");
    extraDetails.classList.add("open");
  }

  todoCard.replaceWith(newCard);
}

/**
 * Removes a todo card from the DOM.
 *
 * @param {string} todoId - The unique ID of the todo card to remove
 */
export function removeTodoCard(todoId) {
  const todoCard = TODO_CARD_DISPLAY.querySelector(
    `[data-todo-id="${todoId}"]`
  );
  if (!todoCard) {
    return;
  }
  todoCard.remove();
}

/**
 * Appends newly created cards to the DOM as they're made.
 *
 * @param {Object} todoObject
 */
export function appendNewCard(todoObject) {
  const newCard = createCard(todoObject);
  TODO_CARD_DISPLAY.appendChild(newCard);
}

/**
 * Creates a populated todo card element from a todo object.
 * Returns a document fragment ready to be appended or used to replace an existing card.
 * @param {Object} todo  - An enriched todo object
 * @returns {DocumentFragment} Populated card template
 */
function createCard(todo) {
  const todoTemplateClone = TODO_CARD_TEMPLATE.content.cloneNode(true);
  const article = todoTemplateClone.querySelector(".todo-card");
  article.dataset.todoId = todo.id;

  const statusButton = todoTemplateClone.querySelector(".todo-status");
  if (todo.completed) {
    statusButton.querySelector("use").setAttribute("href", "#circle-filled");
  }

  const title = todoTemplateClone.querySelector(".todo-title");
  title.textContent = todo.title;

  const priority = todoTemplateClone.querySelector(".todo-priority");
  priority.textContent = todo.priority;
  createPriorityColorBorder(priority, todo.priority);

  const project = todoTemplateClone.querySelector(".todo-project");
  project.textContent = todo.project || "";

  const deadline = todoTemplateClone.querySelector("time");
  if (todo.deadline === null) {
    deadline.textContent = "";
  } else if (todo.deadline) {
    deadline.setAttribute("datetime", todo.deadline);
    deadline.textContent = format(new Date(todo.deadline), "MMM dd, yyyy");
  }

  const description = todoTemplateClone.querySelector(".todo-description");
  description.textContent = todo.description;

  if (todo.checklist) {
    const checklist = todoTemplateClone.querySelector(".todo-checklist");
    todo.checklist.forEach((text, id) => {
      const checklistElement = createChecklistItem(id, text);
      checklist.appendChild(checklistElement);
    });
  }

  return todoTemplateClone;
}

function createChecklistItem(itemId, itemText) {
  const checklistItem = CARD_CHECKLIST_ITEM_TEMPLATE.content.cloneNode(true);

  const div = checklistItem.querySelector("div");
  const input = checklistItem.querySelector("input");
  const label = checklistItem.querySelector("label");

  div.dataset.itemId = itemId;

  input.id = itemId;
  input.name = itemId;

  label.htmlFor = itemId;
  label.textContent = itemText;

  return checklistItem;
}

/**
 * Applies a priority-specific CSS class to an element based on the todo's priority level.
 *
 * @param {HTMLElement} priorityElement - The DOM element to apply the class to
 * @param {string} todoPriority - The priority level ('Low', 'Medium', or 'High')
 * @returns {HTMLElement} The modified element with the appropriate priority class applied
 */
function createPriorityColorBorder(priorityElement, todoPriority) {
  const priorityClasses = {
    Low: "low-priority",
    Medium: "medium-priority",
    High: "high-priority",
  };

  const className = priorityClasses[todoPriority];
  if (className) {
    priorityElement.classList.add(className);
  }

  return priorityElement;
}
