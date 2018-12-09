import { ActivityModel } from "../../codic/activity/constructor";
import { ActivityStatus } from "../../codic/activity/enums";

export default async function(): Promise<Array<ActivityModel>> {
  let list: Array<ActivityModel> = this.list;
  return list.filter(x => x.status === ActivityStatus.ACTIVE);
}
