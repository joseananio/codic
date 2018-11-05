import Activity from "../activity";

export default function(jobs, ...rest) {
  var activity = new Activity(jobs, { driver: this.driver });
  return rest.length > 0 ? activity.every(...rest) : activity;
}
