import Task from "./task";
import { TaskDefinition, TaskConfig, TaskModel } from "./task/constructor";

export default async function assign(
  name: string | TaskModel,
  def: string | TaskDefinition,
  config?: TaskConfig
): Promise<Task> {
  if (!def) {
    throw "Assign requires at least two arguments; Name and task definition";
  }

  if (typeof name !== "string") {
    throw "Invalid Task name. Requires a string";
  }

  const task = new Task(name, def, config);
  const _task = await this.driver.tasks.save(task.toObject());
  return new Task(_task);
}
