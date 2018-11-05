import every from "./every";
import at from "./at";
import disable from "./disable";
import enable from "./enable";
import isDue from "./is-due";
import isActive from "./is-active";
import createTasks from "./create-tasks";
import save from "./save";
import remove from "./remove";
import use from "./use";
import { Activity } from "./constructor";
import getTasks from "./get-tasks";

Activity.prototype = {
  at,
  use,
  save,
  every,
  isDue,
  remove,
  enable,
  disable,
  isActive,
  getTasks,
  createTasks
};

Activity.prototype.updateNextRun = async function(from) {
  this.nextRun = from + this.timesheet * 1000;
  this.lastrun = from;
  return await this.save();
};

Activity.prototype.makeId = function() {
  if (!this.id)
    this.id = Math.random()
      .toString(36)
      .slice(2);
  return this;
};

export default Activity;
