import { AActivity, IActivity, ActivityModel } from "./constructor";
import { TaskModel } from "../task/constructor";

interface IAActivity extends IActivity {
  at(timesheet: number | string): Activity;
  use(data: object): Activity;
  every(timesheet: number | string, ...rest: any): Activity;
  save(): Promise<Activity>;
  remove(): Promise<boolean>;
  enable(): Promise<Activity>;
  disable(): Promise<Activity>;
  startAt(dateTime: Date | string | number): Activity;
  startIn?(dateTime: string): Activity;
  isActive(): boolean;
  isDue(): boolean;
  getTasks(): Promise<any>;
  updateNextRun(from: number): Promise<any>;
  setName(name: string): Activity;
  // makeId(): Activity;
}

class Activity extends AActivity implements IAActivity {
  /**
   * Run activity at a specific time once
   * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
   */
  at(timesheet: number | string): Activity {
    return require("./at").default.apply(this, arguments);
  }

  /**
   * Pass data into the activity. Data will be used by the task during execution
   * @param data data object to pass to activity
   */
  use(data: object): Activity {
    return require("./use").default.apply(this, arguments);
  }

  /**
   * Run activity repeatedly at a given time interval
   * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
   * @param rest others
   */
  every(timesheet: number | string, ...rest: any): Activity {
    return require("./every").default.apply(this, arguments);
  }

  save(): Promise<Activity> {
    return require("./save").default.apply(this);
  }

  remove(): Promise<boolean> {
    return require("./remove").default.apply(this);
  }

  enable(): Promise<Activity> {
    return require("./enable").default.apply(this);
  }

  disable(): Promise<Activity> {
    return require("./disable").default.apply(this);
  }

  setName(name: string): Activity {
    return require("./name").default.apply(this, arguments);
  }

  startAt(dateTime: Date | string | number): Activity {
    return require("./start-at").default.apply(this, arguments);
  }

  startIn(dateTime: string): Activity {
    return require("./start-at").startIn.apply(this, arguments);
  }

  isActive(): boolean {
    return require("./is-active").default.apply(this);
  }

  isDue(): boolean {
    return require("./is-due").default.apply(this);
  }

  getTasks(): Promise<any> {
    return require("./get-tasks").default.apply(this);
  }

  updateNextRun(from?: number): Promise<any> {
    return require("./update-next-run").default.apply(this, arguments);
  }

  addTask(task: TaskModel): Activity {
    return require("./add-task").default.apply(this, arguments);
  }

  failWtih(message: string, time?: number): Activity {
    console.log("failed");
    return require("./fail-with").default.apply(this, arguments);
  }

  /**
   * Returns task formated as a driver object
   * @returns TaskModel
   */
  toObject(): ActivityModel {
    return require("./to-model").default.apply(this);
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
