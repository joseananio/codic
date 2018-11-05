import A_T from './activity-type';
/**
 * Setup repeatition for task
 * @param {String} timesheet time to repeat
 * @param  {...any} rest fn arguments
 */
export default function every(timesheet, ...rest) {
  this.type = A_T.REPEAT;
  this.timesheet = timesheet;
  this.nextRun = Date.now() + timesheet * 1000;
  return rest.length > 0 ? this.use(...rest) : this;
}
