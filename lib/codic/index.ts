import { ACodic, IACodic } from "./constructor";
import Activity from "./activity/index";
import Task from "./task/index";
import { TaskModel, TaskDefinition, TaskConfig } from "./task/constructor";

import start from "./start";
import run from "./run";
import assign from "./assign";
import pause from "./pause"; //pause
import runThrough from "./run-through";

interface ICodic extends IACodic {
  run(
    tasks: string | Array<string>,
    timesheet?: number | string,
    data?: any
  ): Activity;

  assign(
    name: string | TaskModel,
    def: string | TaskDefinition,
    config?: TaskConfig
  ): Promise<Task>;

  start(): Promise<void>;

  pause(): Promise<Codic>;

  // _runThrough(cb?: Function): Promise<void>;
}

class Codic extends ACodic implements ICodic {
  /**
   * Create a new activity. Activity requires a list of tasks,
   * time schedule and optional input data
   * @param tasks list of tasks (jobs) to run
   * @param timesheet time to run task
   * @param data data to pass to task
   */
  run(
    tasks: string | Array<string>,
    timesheet?: number | string,
    data?: any
  ): Activity {
    return run.apply(this, arguments);
  }

  /**
   * Create a new task that will be executed by activities
   * @param name task name
   * @param definition task definition. The whole function or path to the defined task function
   * @param config optional configurations for task
   */
  assign(
    name: string | TaskModel,
    definition: string | TaskDefinition,
    config?: TaskConfig
  ): Promise<Task> {
    return assign.apply(this, arguments);
  }

  /**
   * Start codic
   */
  start(): Promise<void> {
    return start.apply(this);
  }

  /**
   * Pause codic
   * @param activityName optional. pause a specific activity only
   */
  pause(activityName?: string): Promise<Codic> {
    return pause.apply(this, arguments);
  }

  /**
   * private method
   * @param cb callback function
   */
  private _runThrough(cb: Function): Promise<void> {
    return runThrough.apply(this, arguments);
  }

  /**
   * Private method
   */
  private _tryRun() {
    let that = this;
    this._runThrough(function(err, nextRun) {
      setTimeout(async function() {
        that._tryRun();
      }, nextRun);
    });
  }
}
export default Codic;
export { default as Task } from "./task/index";
export { default as Activity } from "./activity/index";
