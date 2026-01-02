import { Project } from "./projectClass";

export function createProjectFromFormData(formData) {
  const projectName = formData.get("project-name").trim();
  return new Project(projectName);
}

export function createProjectFromLocalStorage(jsonObj) {
  return Project.fromJSON(jsonObj);
}
