import { ActivityModel } from "../../codic/activity/constructor";

export default async function getDueList(): Promise<Array<ActivityModel>> {
  //   var __due = [];
  var now = Date.now();

  var activeList = await this.getActive();
  return activeList.filter(activity => isDue(activity, now));
  /* activeList.forEach(activity => {
    if (isDue(activity, now)) {
      __due.push(activity);
    }
  }); 
  return __due;
 */
}

function isDue(activity: ActivityModel, at: number): boolean {
  return activity.nextRun - new Date(at).valueOf() <= 0;
}
