import saveTask from "./save";
import getTask from "./get";
import getTasks from "./get-tasks";
import getTasksRaw from "./get-tasks-raw";
import removeTask from "./remove";

function Tasks() {}

Tasks.prototype = {
  getTask,
  saveTask,
  removeTask,
  getTasks,
  getTasksRaw
};

export default Tasks;
