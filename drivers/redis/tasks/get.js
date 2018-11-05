import recreateTask from "./recreate-task";

export default async function(name) {
  var tasks = await this.getTasks();
  var task = tasks.find(task => task.name === name);
  return task ? recreateTask(task) : null;
}
