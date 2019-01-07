import { ActivityType } from "./enums";
import Activity from ".";
import { generateTime } from "./helper";

/**
 * Setup repetition interval for task
 * @param {String} timesheet time to repeat in miliseconds or human-readable
 * @param  any rest fn arguments
 */
export default function every(
  timesheet: number | string,
  ...rest: any
): Activity {
  this.type = ActivityType.REPEAT;
  this.timesheet = generateTime(timesheet);
  console.log(this.attrs);
  if (!this.nextRun) this.nextRun = Date.now() + this.timesheet;
  if (this.attrs.skipInitial && !this.lastRun) this.skip();
  if (rest.length > 0) {
    let [data] = rest;
    return this.use(data);
  }
  return this;
}
