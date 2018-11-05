import Tasks from "./tasks";
import Activities from "./activities";

import Redis from "ioredis";

function driver(config = null) {
  this.db = new Redis(config);
  this.keyBase = "codi";
//   console.log("redis");
}


var tasks = new Tasks();
var activities = new Activities();

driver.prototype = {
  saveTask: tasks.saveTask,
  getTask: tasks.getTask,
  removeTask: tasks.removeTask,
  getTasks: tasks.getTasks,
  getTasksRaw: tasks.getTasksRaw,
  getActivity: activities.getActivity,
  saveActivity: activities.saveActivity,
  getActivities: activities.getActivities,
  getActiveActivities: activities.getActiveActivities,
  getActivitiesRaw: activities.getActivitiesRaw,
  getDueActivities: activities.getDueActivities,
  getNextRunDelay: activities.getNextRunDelay,
  dropActivities: activities.clean,
  getNextRunDelay: activities.getNextRunDelay,
  recreateActivity: activities.recreateActivity,
};

export default driver;
