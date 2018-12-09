import { TaskModel } from "../task/constructor";
import Activity from ".";

export default function addTask(task: TaskModel): Activity {
  if (!this.taskNames.includes(task.name)) {
    this.taskNames.push(task.name);
    this.tasks.push(task);
  } else {
    this.tasks = this.tasks.map(t => (t.name === task.name ? task : t));
  }
  return this;
}
