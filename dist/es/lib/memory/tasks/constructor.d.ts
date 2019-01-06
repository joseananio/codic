import { TaskModel } from "../../codic/task/constructor";
export interface IATasks {
    /**
     * Storage object for in-memory storage. Other drivers may not need this
     * @property lists
     */
    list?: Array<TaskModel>;
}
export declare abstract class ATasks implements IATasks {
    list: Array<TaskModel>;
    /**
     * Create a new tasks storage
     */
    constructor();
}
