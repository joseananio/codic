import { ActivityModel } from "../../codic/activity/constructor";

/**
 * Get a single activity by name
 * @param {string} name name of activity
 * @returns Promise<ActivityModel>
 */
export async function get(name: string): Promise<ActivityModel> {
  return (await this.list.find(activity => activity._name === name)) || null;
}

/**
 * Get a single activity by id
 * The activity should have been saved in the driver first
 * Not yet available in memory
 * @param {string} name name of activity
 * @returns Promise<ActivityModel>
 */
export async function getById(id: string | number): Promise<ActivityModel> {
  return (await this.list.find(activity => activity.id === id)) || null;
}
