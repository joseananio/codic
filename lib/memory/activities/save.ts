import { ActivityModel } from "../../codic/activity/constructor";

interface saveFunc {
  (activity: ActivityModel): Promise<ActivityModel>;
}

/**
 * Save activity into memory
 * Updates if name exists
 * @param {ActivityModel} activity activity model object
 * @returns Promise<ActivityModel>
 */
let save: saveFunc = async function(activity: ActivityModel) {
  var exists = false;
  var activities = this.list;

  activities.forEach(function(_activity: ActivityModel, key: number) {
    if (activity._name && _activity._name === activity._name) {
      activities[key] = activity;
      exists = true;
    }
  });

  if (!exists) {
    activity.id = activities.length + 1;
    activities.push(activity);
  }
  this.list = activities;
  return activity;
};

export default save;
