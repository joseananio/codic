import JSONfn from "../../../src/utils/to-from-json";

export default async function(activity) {
  var current = await this.getActivitiesRaw();
  var exist = current.find(
    x =>
      x.timesheet === activity.timesheet &&
      JSONfn.stringify(x.tasks) == JSONfn.stringify(activity.tasks)
  );
  delete activity.driver;

  if (!exist) {
    activity.makeId();
    current.push(activity);
  } else current = current.map(x => (x.id === activity.id ? activity : x));

  await this.db.set(this.keyBase + ":activity", JSONfn.stringify(current));
  activity.driver = this;
  return activity;
}
