import { createObjectManager } from "../../objectManagers/createObjManager";

const {
  addObject: addProject,
  getAllObjects: getAllProjects,
  getObject: getProject,
  deleteObject: deleteProject,
} = createObjectManager();

export const PROJECT_OBJECT_MANAGER = {
  addProject,
  getAllProjects,
  getProject,
  deleteProject,
};
