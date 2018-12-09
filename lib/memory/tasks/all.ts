import { TaskModel } from "../../codic/task/constructor";

/**
 * Returns a list of all tasks
 * @returns Promise<Array<TaskModel>>
 */
export default async function all(): Promise<Array<TaskModel>> {
  return this.list;
}
