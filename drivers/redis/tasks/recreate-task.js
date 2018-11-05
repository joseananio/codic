import Task from "../../../src/lib/task";

export default function recreateTask(task) {
  let { name, definition, ...config } = task;
  return new Task(name, config, definition);
}
