import { initializeStorage } from "./modules/storage/localStorageUtils";

import { initializeProjectFormListeners } from "./modules/forms/projectForm/projectFormController";
import { initializeTodoFormListeners } from "./modules/forms/todoForm/todoFormController";

import { initializeProjectStates } from "./modules/state/projectState/projectStateController";
import { initializeTodoStates } from "./modules/state/todoState/todoStateController";

import { initializeFilterTabListeners } from "./modules/state/filterState/filterStateController";

import { initializeMobileMenuListeners } from "./modules/ui/mobileSidebar/mobileSidebarController";

import "./styles/styles.css";

initializeStorage();

initializeProjectFormListeners();
initializeTodoFormListeners();

initializeTodoStates();
initializeProjectStates();

initializeFilterTabListeners();
initializeMobileMenuListeners();
