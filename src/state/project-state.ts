import * as Project from "../models/project";

//Project State Management
type Listener<T> = (items: T[]) => void;

export class State<T>
{
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>)
    {
        this.listeners.push(listenerFn);
    }
}

export class ProjectState extends State<Project.Project>
{
    private projects: Project.Project[] = [];
    private static instance: ProjectState;
    private constructor()
    {
        //Call the constructor of the base class
        super();
    }
    static getInstance()
    {
        if (this.instance)
        {
            return this.instance;
        }
        this.instance = new ProjectState;
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number)
    {
        const newProject = new Project.Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            Project.ProjectStatus.Active
        );
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId: string, newStatus: Project.ProjectStatus)
    {
        /*Find searches every element in this array, and gives us access
        to every element and then we have to return true if its the element we are looking for
        return true if the id of the element we are looking at is equal to the project id */
        const project = this.projects.find(prj => prj.id === projectId);
        //If project exists & status is different from new status, set status to the new status
        if (project && project.status !== newStatus)
        {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    private updateListeners()
    {
        for (const listenerFn of this.listeners)
        {
            listenerFn(this.projects.slice());
        }
    }
}
//exported constants present in multiple files, only run once
export const projectState = ProjectState.getInstance();