export class Project {
    static ID_PREFIX = 'project_';

    static fromJSON(jsonObj) {
        const project = Object.create(Project.prototype);
        project.id = jsonObj.id;
        project.name = jsonObj.name;
        project.linkedIds = new Set(jsonObj.linkedIds);
        return project;
    }

    constructor(name, linkedIds = new Set()) {
        this.id = `${Project.ID_PREFIX}${crypto.randomUUID()}`;
        this.name = name;

        if (!(linkedIds instanceof Set)) { 
            throw new Error('linkedIds must be a Set');
        }
        this.linkedIds = linkedIds;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            linkedIds: Array.from(this.linkedIds),
        }
    }

    addLinkedId(id) {
        this.linkedIds.add(id);
    }

    removeLinkedId(id) {
        this.linkedIds.delete(id);
    }
}