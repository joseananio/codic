import { TaskModel } from "../task/constructor";
import Activity from ".";
import createTasks from "./create-tasks";

export default function addTask(task: string | Array<string>): Activity {
  let taskNames = createTasks(task);
  this.taskNames = Array.from(new Set([...this.taskNames, ...taskNames]));
  return this;
}
