import A_T from "./activity-type";
import hi from "human-interval";

/**
 * Setup repeatition for task
 * @param {String} timesheet time to repeat in miliseconds or human-readable
 * @param  {...any} rest fn arguments
 */
export default function every(timesheet, ...rest) {
  this.type = A_T.REPEAT;
  this.timesheet = generateTime(timesheet);
  if (!this.nextRun) this.nextRun = Date.now() + this.timesheet;
  return rest.length > 0 ? this.use(...rest) : this;
}

const generateTime = timesheet => {
  if (/^[0-9]+$/.test(timesheet)) return timesheet;
  return hi(timesheet);
};
