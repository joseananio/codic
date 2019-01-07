import { AActivity, IActivity, ActivityModel } from "./constructor";
import { TaskModel } from "../task/constructor";

import updateNextRun from "./update-next-run";
import { startAt, startIn } from "./start-at";
import getTasks from "./get-tasks";
import isActive from "./is-active";
import failWtih from "./fail-with";
import toObject from "./to-model";
import addTask from "./add-task";
import disable from "./disable";
import enable from "./enable";
import remove from "./remove";
import isDue from "./is-due";
import setName from "./name";
import every from "./every";
import save from "./save";
import use from "./use";
import at from "./at";

interface IAActivity extends IActivity {
  every(timesheet: number | string, ...rest: any): Activity;
  startAt(dateTime: Date | string | number): Activity;
  addTask(task: string | Array<string>): Activity;
  updateNextRun(from: number): Promise<any>;
  at(timesheet: number | string): Activity;
  startIn?(dateTime: string): Activity;
  setName(name: string): Activity;
  disable(): Promise<Activity>;
  enable(): Promise<Activity>;
  use(data: object): Activity;
  remove(): Promise<boolean>;
  save(): Promise<Activity>;
  getTasks(): Promise<any>;
  isActive(): boolean;
  isDue(): boolean;
  skip(): Activity;
  // makeId(): Activity;
}

class Activity extends AActivity implements IAActivity {
  /**
   * Run activity at a specific time once
   * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
   */
  at(timesheet: number | string): Activity {
    return at.apply(this, arguments);
  }

  /**
   * Pass data into the activity. Data will be used by the task during execution
   * @param data data object to pass to activity
   */
  use(data: object): Activity {
    return use.apply(this, arguments);
  }

  /**
   * Run activity repeatedly at a given time interval
   * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
   * @param rest others
   */
  every(timesheet: number | string, ...rest: any): Activity {
    return every.apply(this, arguments);
  }

  save(): Promise<Activity> {
    return save.apply(this);
  }

  remove(): Promise<boolean> {
    return remove.apply(this);
  }

  enable(): Promise<Activity> {
    return enable.apply(this);
  }

  disable(): Promise<Activity> {
    return disable.apply(this);
  }

  setName(name: string): Activity {
    return setName.apply(this, arguments);
  }

  startAt(dateTime: Date | string | number): Activity {
    return startAt.apply(this, arguments);
  }

  startIn(dateTime: string): Activity {
    return startIn.apply(this, arguments);
  }

  isActive(): boolean {
    return isActive.apply(this);
  }

  isDue(): boolean {
    return isDue.apply(this);
  }

  getTasks(): Promise<any> {
    return getTasks.apply(this);
  }

  updateNextRun(from?: number): Promise<any> {
    return updateNextRun.apply(this, arguments);
  }

  addTask(task: string | Array<string>): Activity {
    return addTask.apply(this, arguments);
  }

  failWtih(message: string, time?: number): Activity {
    return failWtih.apply(this, arguments);
  }

  skip(): Activity {
    let prevNext = this.nextRun;
    this.nextRun += this.timesheet;
    this.lastRun = prevNext;
    console.log("skip", this.lastRun,this.attrs.skipInitial);
    return this;
  }

  /**
   * Returns task formated as a driver object
   * @returns TaskModel
   */
  toObject(): ActivityModel {
    return toObject.apply(this);
  }

  /**
   * Generate a random Id for the activity
   * @returns Activity
   */
  /*  private makeId(): Activity {
    if (!this.id)
      this.id = Math.random()
        .toString(36)
        .slice(2);
    return this;
  } */
}

export default Activity;
