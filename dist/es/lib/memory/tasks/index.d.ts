import { ATasks, IATasks } from "./constructor";
import { TaskModel } from "../../codic/task/constructor";
interface ITasks extends IATasks {
    getById?(id: string | number): Promise<TaskModel>;
    save(activity: TaskModel): Promise<TaskModel>;
    get(name: string): Promise<TaskModel>;
    all(): Promise<Array<TaskModel>>;
    clear(): Promise<number>;
}
declare class Tasks extends ATasks implements ITasks {
    /**
     * Fetch all tasks in storage
     */
    all(): Promise<Array<TaskModel>>;
    /**
     * Get a single task by name
     * @param name name of task
     */
    get(name: string): Promise<TaskModel>;
    /**
     * Get a single task by id
     * @param id id of task
     */
    getById(id: string | number): Promise<TaskModel>;
    /**
     * Save a task to storage
     * @param activity task model object
     */
    save(task: TaskModel): Promise<TaskModel>;
    /**
     * Remove all tasks from storage
     * Returns number of items removed
     */
    clear(): Promise<number>;
}
export default Tasks;
