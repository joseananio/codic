import { ATask, TaskModel, TaskDefinition, TaskConfig } from "./constructor";

export namespace Codic {
  export interface ITask {
    name: string;
    id?: string | number;
    config: TaskConfig;
    _definition?: string | TaskDefinition;
    toObject(): TaskModel;
  }
}

class Task extends ATask implements Codic.ITask {
  /**
   * Returns task formated as a driver object
   * @returns TaskModel
   */
  toObject(): TaskModel {
    return require("./to-model").default.apply(this);
  }
}

export default Task;
