import Activity from ".";
import { ActivityModel } from "./constructor";
//see
// enable
// disable

export default async function save(): Promise<Activity> {
  if (!this.driver) throw "Driver not found on Activitys";
  if (
    !this.driver.activities ||
    !this.driver.activities.save ||
    typeof this.driver.activities.save !== "function"
  )
    throw "Driver does not implement Activities properly. save is undefined";

  let activity: ActivityModel = await this.driver.activities.save(
    this.toObject()
  );
  this._copyConfig(activity);
  return this;
}
