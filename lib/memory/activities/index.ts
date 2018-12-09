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

class Activities extends AActivities implements IActivities {
  getActive(): Promise<ActivityModel[]> {
    return require("./get-active").default.apply(this);
  }
  all(): Promise<ActivityModel> {
    return require("./all").default.apply(this);
  }
  get(name: string): Promise<ActivityModel> {
    return require("./get").default.apply(this, arguments);
  }
  getById(id: string | number): Promise<ActivityModel> {
    return require("./get").getById.apply(this, arguments);
  }
  save(activity: ActivityModel): Promise<ActivityModel> {
    return require("./save").default.apply(this, arguments);
  }
  clear(): Promise<number> {
    return require("./clear").default.apply(this);
  }
  getDueList(): Promise<Array<ActivityModel>> {
    return require("./get-due-list").default.apply(this);
  }
  getNextRunDelay(): Promise<number> {
    return require("./get-next-delay").default.apply(this);
  }
}
export default Activities;
