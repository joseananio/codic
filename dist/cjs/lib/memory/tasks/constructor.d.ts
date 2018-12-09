import { TaskModel } from "../../codic/task/constructor";
export declare function Tasks(): void;
export interface IATasks {
    list: Array<TaskModel>;
}
export declare abstract class ATasks implements IATasks {
    list: Array<TaskModel>;
    /**
     * Create a new tasks storage
     */
    constructor();
}
