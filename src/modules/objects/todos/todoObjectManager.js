import { createObjectManager } from "../../objectManagers/createObjManager";

const {
  addObject: addTodo,
  getAllObjects: getAllTodos,
  getObject: getTodo,
  deleteObject: deleteTodo,
} = createObjectManager();

export const TODO_OBJECT_MANAGER = {
  addTodo,
  getAllTodos,
  getTodo,
  deleteTodo,
};
