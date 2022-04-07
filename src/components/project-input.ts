import { Component } from "./base-component";
import * as Validation from "../util/validation";
import { Autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

//ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>
{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor()
    {
        //Call the constructor on the base class
        super("project-input", "app", true, "user-input");
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;
        this.configure();
    }
    configure()
    {
        this.element.addEventListener("submit", this.submitHandler)
    }
    renderContent(): void { };

    private gatherUserInput(): [ string, string, number ] | void
    {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validation.Validatable =
        {
            value: enteredTitle,
            required: true
        };
        const descriptonValidatable: Validation.Validatable =
        {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validation.Validatable =
        {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (!Validation.validate(titleValidatable) ||
            !Validation.validate(descriptonValidatable) ||
            !Validation.validate(peopleValidatable))
        {
            alert("Invalid input, please try again!");
            return;
        }
        else
        {
            return [ enteredTitle, enteredDescription, +enteredPeople ];
        }
    }
    private clearInputs()
    {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    @Autobind
    private submitHandler(event: Event)
    {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput))
        {
            const [ title, desc, people ] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}