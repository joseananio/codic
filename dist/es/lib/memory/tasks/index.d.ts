import { ATasks, IATasks } from "./constructor";
import { TaskModel } from "../../codic/task/constructor";
interface ITasks extends IATasks {
    all(): Promise<TaskModel>;
    get(name: string): Promise<TaskModel>;
    getById?(id: string | number): Promise<TaskModel>;
    save(activity: TaskModel): Promise<TaskModel>;
    clear(): number;
}
declare class Tasks extends ATasks implements ITasks {
    all(): Promise<TaskModel>;
    get(name: string): Promise<TaskModel>;
    getById(id: string | number): Promise<TaskModel>;
    save(activity: TaskModel): Promise<TaskModel>;
    clear(): number;
}
export default Tasks;
