import { ActivityType } from "./enums";
import Activity from ".";
import { generateTime } from "./helper";

export default function at(timesheet: number | string): Activity {
  this.type = ActivityType.ONCE;
  this.timesheet = generateTime(timesheet);
  return this;
}
