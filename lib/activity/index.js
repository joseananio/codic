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
import updateNextRun from "./update-next-run";
import name from "./name";
import startAt from "./start-at";

var proto = Activity.prototype;

proto.at = at;
proto.use = use;
proto.name = name;
proto.save = save;
proto.every = every;
proto.isDue = isDue;
proto.remove = remove;
proto.enable = enable;
proto.disable = disable;
proto.startAt = startAt;
proto.isActive = isActive;
proto.getTasks = getTasks;
proto.createTasks = createTasks;
proto.updateNextRun = updateNextRun;

Activity.prototype = proto;

Activity.prototype.makeId = function() {
  if (!this.id)
    this.id = Math.random()
      .toString(36)
      .slice(2);
  return this;
};

export default Activity;
