import { ATask, TaskModel, IATask } from "./constructor";

import toObject from "./to-model";

export interface ITask extends IATask {
  toObject(): TaskModel;
}

class Task extends ATask implements ITask {
  /**
   * Returns task formated as a driver object
   * @returns TaskModel
   */
  toObject(): TaskModel {
    return toObject.apply(this);
  }
}

export default Task;
