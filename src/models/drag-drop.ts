//Drag & Drop Interfaces
export interface Draggable
{
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}
export interface DragTarget
{
    //Drag over handler signals the browser that
    //the thing you are dragging something over, is a valid drag target
    dragOverHandler(event: DragEvent): void;
    //The dropHandler reacts to the actual "drop" that happens
    dropHandler(event: DragEvent): void;
    //Can be used for visual feedback
    dragLeaveHandler(event: DragEvent): void;
}