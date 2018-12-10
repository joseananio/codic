import { TaskModel } from "../../codic/task/constructor";

/**
 * Get a single task by name
 * @param {string} name name of task
 * @returns Promise<TaskModel>
 */
export async function get(name: string): Promise<TaskModel> {
  return await this.list.find(task => task.name === name);
}

/**
 * Get a single task by id
 * The task should have been saved in the driver first
 * Not yet available in memory
 * @param {string} name name of task
 * @returns Promise<TaskModel>
 */
export async function getById(id: string | number): Promise<TaskModel> {
  return await this.list.find(task => task.id === id);
}
