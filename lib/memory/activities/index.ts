import { AActivities, IAActivities } from "./constructor";
import { ActivityModel } from "../../codic/activity/constructor";

import all from "./all";
import { get, getById } from "./get";
import save from "./save";
import clear from "./clear";
import getActive from "./get-active";
import getDueList from "./get-due-list";
import getNextRunDelay from "./get-next-delay";

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
    return getActive.apply(this);
  }
  all(): Promise<ActivityModel> {
    return all.apply(this);
  }
  get(name: string): Promise<ActivityModel> {
    return get.apply(this, arguments);
  }
  getById(id: string | number): Promise<ActivityModel> {
    return getById.apply(this, arguments);
  }
  save(activity: ActivityModel): Promise<ActivityModel> {
    return save.apply(this, arguments);
  }
  clear(): Promise<number> {
    return clear.apply(this);
  }
  getDueList(): Promise<Array<ActivityModel>> {
    return getDueList.apply(this);
  }
  getNextRunDelay(): Promise<number> {
    return getNextRunDelay.apply(this);
  }
}
export default Activities;
