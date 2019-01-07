import Activity from "./activity";

function run(tasks: string | Array<string>, ...rest: any): Activity {
  var activity = new Activity(tasks, { driver: this.driver });
  if (rest.length > 0) {
    let [timesheet, ...rrest] = rest;
    return activity.every(timesheet, ...rrest);
  }
  return activity;
}
export default run;
