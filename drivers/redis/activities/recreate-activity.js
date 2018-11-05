import Activity from "../../../src/lib/activity";

export default function recreateActivity(activity) {
  let { tasks, ...config } = activity;
  config.driver = this;
  return new Activity(tasks, config);
}
