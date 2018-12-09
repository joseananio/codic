import { ActivityModel } from "../../codic/activity/constructor";
export interface IAActivities {
    list: Array<ActivityModel>;
}
export declare abstract class AActivities implements IAActivities {
    list: Array<ActivityModel>;
    /**
     * Create a new activity storage
     */
    constructor();
}
