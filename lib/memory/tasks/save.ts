import { TaskModel } from "../../codic/task/constructor";

interface saveFunc {
  (task: TaskModel): Promise<TaskModel>;
}

/**
 * Save task into memory
 * Updates if name exists
 * @param {TaskModel} task task model object
 * @returns Promise<TaskModel>
 */
let save: saveFunc = async function(task) {
  var exists = false;
  var tasks = this.list;
  tasks.forEach(function(_task, key) {
    if (_task.name === task.name) {
      tasks[key] = task;
      exists = true;
    }
  });

  if (!exists) tasks.push(task);
  this.list = tasks;
  return task;
};

export default save;
