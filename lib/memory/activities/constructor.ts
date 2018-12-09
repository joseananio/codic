import { ActivityModel } from "../../codic/activity/constructor";

export interface IAActivities {
  list: Array<ActivityModel>;
}

export abstract class AActivities implements IAActivities {
  public list: Array<ActivityModel> = new Array();
  /**
   * Create a new activity storage
   */
  constructor() {}
}
