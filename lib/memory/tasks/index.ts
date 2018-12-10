import { ATasks, IATasks } from "./constructor";
import { get, getById } from "./get";
import all from "./all";
import save from "./save";
import clear from "./clear";
import { TaskModel } from "../../codic/task/constructor";

interface ITasks extends IATasks {
  getById?(id: string | number): Promise<TaskModel>;
  save(activity: TaskModel): Promise<TaskModel>;
  get(name: string): Promise<TaskModel>;
  all(): Promise<Array<TaskModel>>;
  clear(): Promise<number>;
}

class Tasks extends ATasks implements ITasks {
  /**
   * Fetch all tasks in storage
   */
  all(): Promise<Array<TaskModel>> {
    return all.apply(this);
  }

  /**
   * Get a single task by name
   * @param name name of task
   */
  get(name: string): Promise<TaskModel> {
    return get.apply(this, arguments);
  }

  /**
   * Get a single task by id
   * @param id id of task
   */
  getById(id: string | number): Promise<TaskModel> {
    return getById.apply(this, arguments);
  }

  /**
   * Save a task to storage
   * @param activity task model object
   */
  save(task: TaskModel): Promise<TaskModel> {
    return save.apply(this, arguments);
  }

  /**
   * Remove all tasks from storage
   * Returns number of items removed
   */
  clear(): Promise<number> {
    return clear.apply(this);
  }
}

export default Tasks;
