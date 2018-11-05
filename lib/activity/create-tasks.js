export default function createTasks(tasks) {
  if (typeof tasks === "string" && tasks.length > 0) tasks = [tasks];

  if (!Array.isArray(tasks)) throw new Error("Tasks requires array or string");
  if (tasks.length == 0) throw new Error("No tasks defined for activity");
  this.tasks = tasks;
}
