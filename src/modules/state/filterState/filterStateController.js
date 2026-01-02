import { triggerCustomEvent } from "../../events/eventProducer";
import { EVENTS } from "../../events/events";

const GENERAL_TABS = document.getElementById("general-categories");
const PROJECT_TABS = document.getElementById("projects-list");

const DEFAULT_TYPE = "general";
const DEFAULT_DISPLAY = "all";

const FILTER_STATE = {
  type: DEFAULT_TYPE,
  display: DEFAULT_DISPLAY,
};

const CSS_CURRENT_TAB = "current-tab";

export function initializeFilterTabListeners() {
  assignCurrentTabColor();

  document.addEventListener(EVENTS.UPDATE_DISPLAY, () => {
    assignCurrentTabColor();
  });

  GENERAL_TABS.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("button");

    if (!categoryButton) {
      return;
    }
    if (categoryButton.classList.contains("category-btn") === false) {
      return;
    }

    const filterType = categoryButton.dataset.filterType;
    const filterDisplay = categoryButton.dataset.filterDisplay;

    updateFilterState(filterType, filterDisplay);
  });

  PROJECT_TABS.addEventListener("click", (event) => {
    const projectButton = event.target.closest("button");

    if (!projectButton) {
      return;
    }
    if (projectButton.dataset.action !== "filter") {
      return;
    }

    const filterType = projectButton.dataset.filterType;
    const projectId = projectButton.dataset.projectId;

    updateFilterState(filterType, projectId);
  });
}

export function getFilterState() {
  return structuredClone(FILTER_STATE);
}

export function resetFilterStateToDefault() {
  FILTER_STATE.type = DEFAULT_TYPE;
  FILTER_STATE.display = DEFAULT_DISPLAY;
}

/**Updates the FILTER_STATE to track the last clicked filter button.
 *
 * Emits an event for the render states to listen for to display the relevant todo objects.
 */
function updateFilterState(type, display) {
  FILTER_STATE.type = type;
  FILTER_STATE.display = display;
  triggerCustomEvent(document, EVENTS.UPDATE_DISPLAY);

  assignCurrentTabColor();
}

/**Assigns a custom class to filter button element
 * that visually represents it is the most recent button to be clicked.
 *
 * The DOM is queried for all elements with the .css class, and then the class
 * is removed from those elements in a forEach loop to prevent
 * multiple elements having this class at the same time.
 *
 * Then, depending on the filter state it either looks for a filter-type
 * or project-id dataset before assigning the class to the button.
 *
 * If the element could not be located, then this function terminates by returning null,
 * silently failing. This is fine because the visual representation of the last clicked button
 * is not critically important to the usage and function of the website.
 */
function assignCurrentTabColor() {
  document.querySelectorAll(`.${CSS_CURRENT_TAB}`).forEach((btn) => {
    btn.classList.remove(CSS_CURRENT_TAB);
  });

  let currentButton;
  if (FILTER_STATE.type === "general") {
    currentButton = document.querySelector(
      `[data-filter-type="${FILTER_STATE.type}"][data-filter-display="${FILTER_STATE.display}"]`
    );
  }

  if (FILTER_STATE.type === "project") {
    currentButton = document.querySelector(
      `[data-filter-type="${FILTER_STATE.type}"][data-project-id="${FILTER_STATE.display}"]`
    );
  }

  if (!currentButton) {
    return null;
  }
  currentButton.classList.add(CSS_CURRENT_TAB);
}
