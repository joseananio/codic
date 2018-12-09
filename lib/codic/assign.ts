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
  if (typeof def !== "function" && typeof def !== "string") {
    throw "Invalid Job definition. Requires a function or full path to function";
  }
  if (typeof config !== "object") {
    throw "Invalid config parameter. Requires an object";
  }

  const task = new Task(name, def, config);
  await this.driver.tasks.save(task.toObject());
  return task;
}
