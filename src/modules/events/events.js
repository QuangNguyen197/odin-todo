export const EVENTS = {
  /**An event that signals the New Todo Form has sent a POST request.
   *
   * State managers listen for this event and use the event's data to construct
   * new Todo Objects.
   */
  TODO_FORM_SUBMITTED: "todo:formSubmitted",

  /**An event that signals the 'edit' button on a Todo card has been clicked.
   *
   * State managers listen for this event and use the event's data to retrieve the object
   * it is representing. Then, that object's properties are used to pre-populate a form.
   */
  TODO_EDIT_REQUESTED: "todo:editRequested",

  /**This event signals that an existing Todo Object has been modified.
   *
   * The Todo Object State manager will emit this event if an existing object has had
   * it's data mutated in some way.
   *
   * The Todo UI State manager listens for this event and calls a UI function that will
   * modify the visual representation of the object with the updated details.
   */
  TODO_OBJECT_EDITED: "todo:objectEdited",

  /**This event signals that the delete button on a todo card has been clicked.
   *
   * When this event is emitted, state listeners listening for it begin deleting
   * the respective object the card was made from.
   *
   * This event passses the Todo Object Id stored in the card metadata.
   */
  TODO_DELETE_REQUESTED: "todo:deleteRequested",

  /**This event signals that a Todo Object has been deleted.
   *
   * When this event is emitted, state listeners listening for it will begin
   * unlinking this object's ID from any data structures that are tracking it.
   *
   * This event passes the Todo Object Id.
   */
  TODO_DELETED: "todo:deleted",

  /**This event signals that a new Todo Object has been created.
   *
   * The Todo Object State manager emits this event when a new todo is added.
   *
   * The Todo UI State manager listens for this event and executes
   * logic that updates the UI with a card representation of the card.
   *
   * This event passes the Todo Object Id.
   */
  TODO_CREATED: "todo:created",

  /**This event signals that a Todo Cards mark complete button has been clicked.
   *
   * When this event is emitted, the Todo Object state controller listens for it
   * and will modify the completed property of the respective object, then
   * tell UI state listeners to re-render the card with updated visuals.
   *
   * This event passes the Todo Object Id.
   */
  TODO_STATUS_UPDATED: "todo:statusUpdated",

  /**An event that signals a checklist input / label has been clicked on
   * a Todo card.
   *
   * The todoCardController in the /ui module will trigger this event to tell
   * the Object state controller to remove the checklist item from the object.
   */
  TODO_CHECKLIST_CLICKED: "todo:checklistClicked",

  /**An event that signals the New Project form has sent a POST request.
   *
   * State managers listen for this event and use the event's data to construct
   * new Project Objects.
   */
  PROJECT_FORM_SUBMITTED: "project:formSubmitted",

  /**An event that signals a project has been assigned to a Todo object.
   *
   * State managers emit this event when a Project has been assigned to an object.
   *
   * The Project State manager listens for this event to link the assigned project
   * and todo object together.
   */
  PROJECT_ASSIGNED: "project:assigned",

  /**An event that signals a project has been removed from
   * a Todo's linkedProject map.
   *
   * Controllers like forms emit this event when an edited object
   * changes it's project value.
   *
   * State managers listening for this event will retrieve the referenced project,
   * and remove the mutated todo's ID from its set.
   *
   * This event is triggered by CRUD events.
   */
  PROJECT_UNASSIGNED: "project:unassigned",

  /**An event that signals an HTML element representing a Project Object has been
   * deleted by the user.
   *
   * State managers listen for this event and invoke thei respective Object manager delete
   * methods.
   */
  PROJECT_DELETE_REQUESTED: "project:deleteRequested",

  /**An event that signals an internal Project Object has been deleted from
   * it's Object manager.
   *
   * State managers listen for this event to unlink any Objects that had a relationship
   * with the deleted Project Object.
   */
  PROJECT_DELETED: "project:deleted",

  /**This event signals that a Project Object has been created and recorded in storage.
   *
   * The Project Object State manager emits this event.
   *
   * The Project UI State manager listens for this event, and signals the UI controller
   * to render the tab to the sidebar.
   *
   * This event passes the Project Object.
   */
  PROJECT_CREATED: "project:created",

  /**This event signals that the Set() Project Objects use has changed.
   *
   * The Project Object manager emits this event anytime the Set() has been mutated, either
   * from adding or removing items to them.
   *
   * The Project UI state manager listens for this event and triggers the UI controller to
   * update the visual counter user's see that shows them how many tasks are linked
   * to a project.
   *
   * This event carries the projectId and the length of the Set().
   */
  PROJECT_SET_MUTATED: "project:setMutated",

  /**A synchronization event that signals the DOM to be refreshed with
   * current data from the internal state.
   *
   * State managers listen for this event and invoke their DOM functions with relevant information
   * retrieved from localStorage and / or object managers.
   *
   * Triggered by CRUD operations.
   */
  UPDATE_DISPLAY: "update:display",
};
