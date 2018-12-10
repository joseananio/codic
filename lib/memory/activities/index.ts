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
  getById?(id: string | number): Promise<ActivityModel>;
  save(activity: ActivityModel): Promise<ActivityModel>;
  getDueList(): Promise<Array<ActivityModel>>;
  getActive(): Promise<Array<ActivityModel>>;
  get(name: string): Promise<ActivityModel>;
  all(): Promise<Array<ActivityModel>>;
  getNextRunDelay(): Promise<number>;
  clear(): Promise<number>;
}

class Activities extends AActivities implements IActivities {
  /**
   * Get all active activities
   */
  getActive(): Promise<Array<ActivityModel>> {
    return getActive.apply(this);
  }

  /**
   * Get all activities
   */
  all(): Promise<Array<ActivityModel>> {
    return all.apply(this);
  }

  /**
   * Get a single activity by name
   * @param name name of activity
   */
  get(name: string): Promise<ActivityModel> {
    return get.apply(this, arguments);
  }

  /**
   * Get a single activity by id
   * @param id id of activity
   */
  getById(id: string | number): Promise<ActivityModel> {
    return getById.apply(this, arguments);
  }

  /**
   * Save activity to storage
   * @param activity activity model object
   */
  save(activity: ActivityModel): Promise<ActivityModel> {
    return save.apply(this, arguments);
  }

  /**
   * Remove all activities from storage
   * Returns number of items removed
   */
  clear(): Promise<number> {
    return clear.apply(this);
  }

  /**
   * Get list of activities that are due for execution.
   * Compares the nextRun with current time
   */
  getDueList(): Promise<Array<ActivityModel>> {
    return getDueList.apply(this);
  }

  /**
   * Get the delay in miliseconds before next closest activity is due
   */
  getNextRunDelay(): Promise<number> {
    return getNextRunDelay.apply(this);
  }
}

export default Activities;
