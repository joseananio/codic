import { ActivityType, ActivityStatus } from "./enums";
import createTasks from "./create-tasks";
import { TaskModel } from "../task/constructor";

///////////////////////
//declarations
//////////////////////
export interface IActivityAttr {
  skipInitial?: boolean;
  data?: object;
}
export interface ActivityModel {
  driver?: any;
  id?: string | number;
  status: ActivityStatus;
  nextRun: number;
  lastRun?: number;
  failedAt?: Date;
  failReason?: string;
  startedAt?: Date;
  type: ActivityType;
  _name?: string;
  attrs: IActivityAttr;
  taskNames: Array<string>;
}

export interface IActivity {
  driver: any;
  id?: string | number;
  status: ActivityStatus;
  nextRun: number;
  lastRun: number;
  failedAt: Date;
  startedAt: Date;
  failReason: string;
  type: ActivityType;
  _name: string;
  attrs: IActivityAttr;
  timesheet: number;
}
export interface IActivityConfig {
  driver?: any;
  id?: string | number;
  status?: ActivityStatus;
  nextRun?: number;
  lastRun?: number;
  failedAt?: Date;
  failReason?: string;
  type?: ActivityType;
  _name?: string;
  attrs?: IActivityAttr;
  timesheet?: number;
  taskNames?: Array<TaskModel>;
}

/////////////////
//internal items
/////////////////
function copyConfig(to: IActivityAttr, from: IActivityAttr);
function copyConfig(to: AActivity, from: IActivityConfig);
function copyConfig(to: any, from: any) {
  if (!from) return to;
  if (from.id) to.id = from.id;
  if (from.driver) to.driver = from.driver;
  if (from.attrs) to.attrs = copyConfig(to.attrs, from.attrs);

  Object.keys(from).forEach(key => {
    if (to[key] !== undefined) to[key] = from[key];
  });
  return to;
}

let defaultAttr: IActivityAttr = {
  skipInitial: true,
  data: null
};

export abstract class AActivity implements IActivity {
  driver: any;
  readonly id?: string | number;
  timesheet: number = 60000;
  status: ActivityStatus = ActivityStatus.ACTIVE;
  nextRun: number = new Date().valueOf();
  lastRun: number = null;
  failedAt: Date = null;
  startedAt: Date = null;
  failReason: string = null;
  type: ActivityType = ActivityType.TEMP;
  _name: string = null;
  attrs: IActivityAttr = defaultAttr;
  taskNames: Array<string> = new Array();
  // tasks?: Array<TaskModel> = new Array();

  /**
   * Create a new codic activity instance.
   * @param model ActivityModel object
   * @param config ActivityConfig object
   */
  constructor(model: ActivityModel, config: IActivityConfig);

  /**
   * Create a new codic activity instance.
   * @param taskNames names of tasks for activity
   * @param config ActivityConfig object
   */
  constructor(taskNames: string | Array<string>, config: IActivityConfig);

  /**
   * Create a new codic activity instance.
   * @param taskNames_model name(s) of the tasks to execute
   * @param config Configuration parameters for activity
   */
  constructor(
    taskNames_model: string | Array<string> | ActivityModel,
    config?: IActivityConfig
  ) {
    if (config) this.config(config);
    if (typeof taskNames_model == "string" || Array.isArray(taskNames_model))
      this._createTasks(taskNames_model);
    else this._createFromModel(taskNames_model);
  }
  config(from: IActivityAttr);
  config(from: IActivityConfig);
  config(from: ActivityModel);
  public config(from: any): AActivity {
    copyConfig(this, from);
    if (!this.lastRun && this.attrs.skipInitial)
      // @ts-ignore
      this.skip();
    return this;
  }

  private _createTasks(taskNames: string | Array<string>): void {
    this.taskNames = createTasks(taskNames);
  }

  private _createFromModel(model: ActivityModel) {
    this.config(model);
    this._createTasks(model.taskNames);
  }
}
