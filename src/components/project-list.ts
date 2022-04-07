import { DragTarget } from "../models/drag-drop";
import * as Project from "../models/project";
import { Component } from "./base-component";
import { Autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item"

//ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget
{
    assignedProjects: Project.Project[];
    constructor(private type: "active" | "finished")
    {
        //Call the constructor of the base class
        super("project-list", "app", false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }
    @Autobind //make sure the this.-keyword is bound to the surrounding class
    //Add styling to the element to signal its droppable
    dragOverHandler(event: DragEvent): void
    {
        if (event.dataTransfer && event.dataTransfer.types[ 0 ] === "text/plain")
        {
            //Default for JavaScript is to now allow dropping
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }
    @Autobind
    dropHandler(event: DragEvent): void
    {
        const prjId = event.dataTransfer!.getData("text/plain");
        //Translate "active" || "finished" to our enum-values
        projectState.moveProject(prjId, this.type === "active" ? Project.ProjectStatus.Active : Project.ProjectStatus.Finished)
    }
    @Autobind
    dragLeaveHandler(_: DragEvent): void
    {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }
    configure()
    {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);

        projectState.addListener((projects: Project.Project[]) =>
        {
            const relevantProjects = projects.filter(prj =>
            {
                if (this.type === "active")
                {
                    return prj.status === Project.ProjectStatus.Active;
                }
                else 
                {
                    return prj.status === Project.ProjectStatus.Finished;
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    };
    renderContent()
    {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    };
    private renderProjects()
    {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects)
        {
            new ProjectItem(this.element.querySelector("ul")!.id, prjItem)
        }
    }
}