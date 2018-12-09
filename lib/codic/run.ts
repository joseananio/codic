import Activity from "./activity";

export default function(jobs: string | Array<string>, ...rest: any): Activity {
  var activity = new Activity(jobs, { driver: this.driver });
  if (rest.length > 0) {
    let [timesheet, ...rrest] = rest;
    return activity.every(timesheet, ...rrest);
  }
  return activity;
}
