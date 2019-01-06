import { ActivityModel } from "../../codic/activity/constructor";
export interface IAActivities {
    /**
     * Storage object for in-memory database. Other drivers may not need this
     * @property list array of activities
     */
    list?: Array<ActivityModel>;
}
export declare abstract class AActivities implements IAActivities {
    list: Array<ActivityModel>;
    /**
     * Create a new activity storage
     */
    constructor();
}
