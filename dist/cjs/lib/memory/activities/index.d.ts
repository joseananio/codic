import { AActivities, IAActivities } from "./constructor";
import { ActivityModel } from "../../codic/activity/constructor";
interface IActivities extends IAActivities {
    getById?(id: string | number): Promise<ActivityModel>;
    save(activity: ActivityModel): Promise<ActivityModel>;
    getDueList(): Promise<Array<ActivityModel>>;
    getActive(): Promise<Array<ActivityModel>>;
    get(name: string): Promise<ActivityModel>;
    all(): Promise<Array<ActivityModel>>;
    getNextRunDelay(): Promise<number>;
    clear(): Promise<number>;
}
declare class Activities extends AActivities implements IActivities {
    /**
     * Get all active activities
     */
    getActive(): Promise<Array<ActivityModel>>;
    /**
     * Get all activities
     */
    all(): Promise<Array<ActivityModel>>;
    /**
     * Get a single activity by name
     * @param name name of activity
     */
    get(name: string): Promise<ActivityModel>;
    /**
     * Get a single activity by id
     * @param id id of activity
     */
    getById(id: string | number): Promise<ActivityModel>;
    /**
     * Save activity to storage
     * @param activity activity model object
     */
    save(activity: ActivityModel): Promise<ActivityModel>;
    /**
     * Remove all activities from storage
     * Returns number of items removed
     */
    clear(): Promise<number>;
    /**
     * Get list of activities that are due for execution.
     * Compares the nextRun with current time
     */
    getDueList(): Promise<Array<ActivityModel>>;
    /**
     * Get the delay in miliseconds before next closest activity is due
     */
    getNextRunDelay(): Promise<number>;
}
export default Activities;
