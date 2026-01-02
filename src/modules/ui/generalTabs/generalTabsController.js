const GENERAL_TABS = document.getElementById("general-categories");

/**
 * Updates the span element that shows how many todos are in that
 * particular general category.
 *
 * @param {string} filterDisplay - Which general tab to query for.
 * @param {int} todoCount - The amount of todo's that are part of this category
 */
export function updateTodoCounter(filterDisplay, todoCount) {
  const selector = `[data-filter-display="${filterDisplay}"]`;
  const generalTab = GENERAL_TABS.querySelector(selector);
  if (!generalTab) {
    return;
  }

  const todoCounter = generalTab.querySelector(".todo-counter");
  todoCounter.textContent = todoCount;
}
