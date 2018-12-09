import Task from "./task";
import { TaskDefinition, TaskConfig, TaskModel } from "./task/constructor";
export default function assign(name: string | TaskModel, def: string | TaskDefinition, config?: TaskConfig): Promise<Task>;
