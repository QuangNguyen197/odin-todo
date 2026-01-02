import { initializeTodoObjState } from "./todoObjectState";
import { initializeTodoUIState } from "./todoUIState";

export function initializeTodoStates() {
  initializeTodoUIState();
  initializeTodoObjState();
}
