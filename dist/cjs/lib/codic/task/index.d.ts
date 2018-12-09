import { ATask, TaskModel, TaskDefinition, TaskConfig } from "./constructor";
export declare namespace Codic {
    interface ITask {
        name: string;
        id?: string | number;
        config: TaskConfig;
        _definition?: string | TaskDefinition;
        toObject(): TaskModel;
    }
}
declare class Task extends ATask implements Codic.ITask {
    /**
     * Returns task formated as a driver object
     * @returns TaskModel
     */
    toObject(): TaskModel;
}
export default Task;
