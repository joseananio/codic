import { TaskConfig, TaskDefinition, TaskModel } from "../task/constructor";
import { ActivityModel } from "../activity/constructor";

export declare namespace Codic {
  // codic task
  export class ITask {
    constructor(
      name: string,
      definition: TaskDefinition | string,
      config: TaskConfig
    );
    name: string;
    id?: string | number;
    config: TaskConfig;
    definition: string | TaskDefinition;
    toObject?(): TaskModel;
  }
  export let TaskModel: TaskModel;
  export let TaskConfig: TaskConfig;

  // codic activity
  export class Activity {
    constructor(tasks: Array<Codic.ITask>);
  }
  export let ActivityModel: ActivityModel;
}
