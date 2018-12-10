import { ATasks, IATasks } from "./constructor";
import { get, getById } from "./get";
import all from "./all";
import save from "./save";
import clear from "./clear";
import { TaskModel } from "../../codic/task/constructor";

interface ITasks extends IATasks {
  all(): Promise<TaskModel>;
  get(name: string): Promise<TaskModel>;
  getById?(id: string | number): Promise<TaskModel>;
  save(activity: TaskModel): Promise<TaskModel>;
  clear(): number;
}

class Tasks extends ATasks implements ITasks {
  all(): Promise<TaskModel> {
    return all.apply(this);
  }
  get(name: string): Promise<TaskModel> {
    return get.apply(this, arguments);
  }
  getById(id: string | number): Promise<TaskModel> {
    return getById.apply(this, arguments);
  }
  save(activity: TaskModel): Promise<TaskModel> {
    return save.apply(this, arguments);
  }
  clear(): number {
    return clear.apply(this);
  }
}

export default Tasks;
