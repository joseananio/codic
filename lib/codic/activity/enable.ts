import { ActivityStatus } from "./enums";
import Activity from ".";

export default async function enable(): Promise<Activity> {
  this.status = ActivityStatus.ACTIVE;
  return await this.save();
}
