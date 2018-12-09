import { TaskModel } from "../../codic/task/constructor";

export function Tasks(): void {
  this.list = new Array();
}

export interface IATasks {
  list: Array<TaskModel>;
}

export abstract class ATasks implements IATasks {
  public list: Array<TaskModel> = new Array();
  /**
   * Create a new tasks storage
   */
  constructor() {}
}
