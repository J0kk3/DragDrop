import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";
import { Component } from "./base-component";
import { Autobind } from "../decorators/autobind";

//ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable
{
    private project: Project;

    get persons()
    {
        if (this.project.people === 1)
        {
            return "1 person";
        }
        else
        {
            return `${this.project.people} persons`
        }
    }

    constructor(hostId: string, project: Project)
    {
        //Call the constructor of the base class
        super("single-project", hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }
    //instead of using .bind(this) to thge dragStartHandler
    @Autobind
    dragStartHandler(event: DragEvent)
    {
        event.dataTransfer!.setData("text/plain", this.project.id);
        //Controls how the cursor will look like, and tells the browser that we plan to move an object
        event.dataTransfer!.effectAllowed = "move";
    }
    //Blank the parameter to tell TS that its not used (event = _)
    dragEndHandler(_: DragEvent)
    {
        console.log("DragEnd");
    }
    configure() 
    {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent()
    {
        //this.element is the rendered element (li-element in "single-project")
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.persons + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}