import { initializeProjectUIState } from "./projectUIState";
import { initializeProjectObjectState } from "./projectObjectState";

export function initializeProjectStates() {
  initializeProjectUIState();
  initializeProjectObjectState();
}
