import { ActivityModel } from "../../codic/activity/constructor";
/**
 * Get a single activity by name
 * @param {string} name name of activity
 * @returns Promise<ActivityModel>
 */
export declare function get(name: string): Promise<ActivityModel>;
/**
 * Get a single activity by id
 * The activity should have been saved in the driver first
 * Not yet available in memory
 * @param {string} name name of activity
 * @returns Promise<ActivityModel>
 */
export declare function getById(id: string | number): Promise<ActivityModel>;
