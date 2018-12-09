import { ActivityModel } from "../../codic/activity/constructor";
interface saveFunc {
    (activity: ActivityModel): Promise<ActivityModel>;
}
/**
 * Save activity into memory and driver
 * Tasks are saved automatically to driver always
 * Updates if name exists
 * @param {ActivityModel} activity activity model object
 * @returns Promise<ActivityModel>
 */
declare let save: saveFunc;
export default save;
