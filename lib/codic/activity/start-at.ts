import Activity from ".";
import { generateTime } from "./helper";

/**
 * specify when to start activity
 * @param {string|int} dateTime datetime as Date, milliseconds or string
 */
export function startAt(dateTime: Date | number | string): Activity {
  if (dateTime instanceof Date) this.nextRun = dateTime.valueOf();
  else {
    let inc: number = generateTime(dateTime);
    this.nextRun = new Date().valueOf() + inc;
  }
  return this;
}

export function startIn(timesheet: string): Activity {
  return startAt(timesheet);
}
