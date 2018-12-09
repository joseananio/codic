export default function createTasks(
  taskNames: string | Array<string>
): Array<string> {
  if (typeof taskNames === "string" && taskNames.length > 0)
    taskNames = [taskNames];

  if (!Array.isArray(taskNames))
    throw new Error("Tasks requires array or string");
  if (taskNames.length == 0) throw new Error("No tasks defined for activity");
  return taskNames;
}
