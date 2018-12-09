import { ActivityStatus } from "./enums";
import Activity from ".";

export default async function disable(): Promise<Activity> {
  this.status = ActivityStatus.DISABLED;
  return await this.save();
}
