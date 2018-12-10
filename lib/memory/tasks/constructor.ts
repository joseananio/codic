import { TaskModel } from "../../codic/task/constructor";

export interface IATasks {
  /**
   * Storage object for in-memory storage. Other drivers may not need this
   * @property lists
   */
  list?: Array<TaskModel>;
}

export abstract class ATasks implements IATasks {
  public list: Array<TaskModel> = new Array();
  /**
   * Create a new tasks storage
   */
  constructor() {}
}
