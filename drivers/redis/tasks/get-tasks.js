import recreateTask from "./recreate-task";

export default async function getTasks() {
  var res = await this.getTasksRaw();
  var tasks = res.map(task => {
    return recreateTask(task);
  });
  return tasks;
}
