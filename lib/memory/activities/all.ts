import { ActivityModel } from "../../codic/activity/constructor";

/**
 * Returns a list of all activities
 * @returns Promise<Array<ActivityModel>>
 */
export default async function all(): Promise<Array<ActivityModel>> {
  return this.list;
}
