import { ATask, TaskModel, IATask } from "./constructor";
export interface ITask extends IATask {
    toObject(): TaskModel;
}
declare class Task extends ATask implements ITask {
    /**
     * Returns task formated as a driver object
     * @returns TaskModel
     */
    toObject(): TaskModel;
}
export default Task;
