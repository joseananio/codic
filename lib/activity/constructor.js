import aType from "./activity-type";
import status from "./activity-status";

export function copyConfig(to, from) {
  if (from.driver) to.driver = from.driver;
  to.id = from.id;
  to._name = from._name;
  Object.keys(from).forEach(key => {
    if (to[key] !== undefined) to[key] = from[key];
  });
  if (!to.nextRun) to.updateNextRun(Date.now());
  return to;
}

export function Activity(tasks, config) {
  this.status = status.ACTIVE;
  this.nextRun = null;
  this.lastRun = null;
  this.failedAt = null;
  this.failReason = null;
  this.type = aType.TEMP;
  this.timesheet = 1000;
  this._name = "";
  this.driver = null;
  this.attrs = {
    skipInitial: true
  };

  copyConfig(this, config);
  this.createTasks(tasks, this.driver);
}
