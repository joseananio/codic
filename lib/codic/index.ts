import { ACodic, IACodic } from "./constructor";
import Activity from "./activity/index";
import Task from "./task/index";
import { TaskModel, TaskDefinition, TaskConfig } from "./task/constructor";

// removeActivity
// resume

interface ICodic extends IACodic {
  run(jobs: string | Array<string>, ...rest: any): Promise<Activity>;

  assign(
    name: string | TaskModel,
    def: string | TaskDefinition,
    config?: TaskConfig
  ): Promise<Task>;

  start(): Promise<void>;

  pause(): Promise<Codic>;

  _runThrough(cb?: Function): Promise<void>;
}

class Codic extends ACodic implements ICodic {
  run(jobs: string | Array<string>, ...rest: any): Promise<Activity> {
    return require("./run").default.apply(this, arguments);
  }

  assign(
    name: string | TaskModel,
    def: string | TaskDefinition,
    config?: TaskConfig
  ): Promise<Task> {
    return require("./assign").default.apply(this, arguments);
  }
  start(): Promise<void> {
    return require("./start").default.apply(this);
  }

  pause(activityName?: string): Promise<Codic> {
    return require("./run").default.apply(this, arguments);
  }

  _runThrough(cb: Function): Promise<void> {
    return require("./run-through").default.apply(this, arguments);
  }

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
