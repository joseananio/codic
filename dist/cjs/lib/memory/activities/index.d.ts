import { AActivities, IAActivities } from "./constructor";
import { ActivityModel } from "../../codic/activity/constructor";
interface IActivities extends IAActivities {
    all(): Promise<ActivityModel>;
    get(name: string): Promise<ActivityModel>;
    getById?(id: string | number): Promise<ActivityModel>;
    save(activity: ActivityModel): Promise<ActivityModel>;
    getActive(): Promise<Array<ActivityModel>>;
    clear(): Promise<number>;
    getDueList(): Promise<Array<ActivityModel>>;
    getNextRunDelay(): Promise<number>;
}
declare class Activities extends AActivities implements IActivities {
    getActive(): Promise<ActivityModel[]>;
    all(): Promise<ActivityModel>;
    get(name: string): Promise<ActivityModel>;
    getById(id: string | number): Promise<ActivityModel>;
    save(activity: ActivityModel): Promise<ActivityModel>;
    clear(): Promise<number>;
    getDueList(): Promise<Array<ActivityModel>>;
    getNextRunDelay(): Promise<number>;
}
export default Activities;
