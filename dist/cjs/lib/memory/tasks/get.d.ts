import { TaskModel } from "../../codic/task/constructor";
/**
 * Get a single task by name
 * @param {string} name name of task
 * @returns Promise<TaskModel>
 */
export default function get(name: string): Promise<TaskModel>;
/**
 * Get a single task by id
 * The task should have been saved in the driver first
 * Not yet available in memory
 * @param {string} name name of task
 * @returns Promise<TaskModel>
 */
export declare function getById(id: string | number): Promise<TaskModel>;
