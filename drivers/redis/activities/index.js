import saveActivity from "./save";
import { getActivities, getActivitiesRaw } from "./get-activities";
import getActiveActivities from "./get-active";
import getNextRunDelay from "./get-next";
import getDueActivities from "./get-due-list";
import getActivity from "./get-by-id";
import clean from "./clean";
import recreateActivity from "./recreate-activity";

function Activities() {
  //read from storage
}

Activities.prototype = {
  clean,
  getActivity,
  saveActivity,
  getActivities,
  getNextRunDelay,
  recreateActivity,
  getDueActivities,
  getActivitiesRaw,
  getActiveActivities
};

export default Activities;
