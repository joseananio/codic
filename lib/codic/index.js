import { Codic } from "./constructor";
import start from "./start";
import run from "./run";
import assign from "./assign";
import pause from "./pause"; //pause
import Activity from "../activity";
import Task from "../task";
import runThrough from "./run-through";
// removeActivity
// resume

var proto = Codic.prototype;

proto.run = run;
proto.pause = pause;
proto.start = start;
proto.assign = assign;
proto.runThrough = runThrough;

Codic.prototype = proto;
Codic.Task = Task;
Codic.Activity = Activity;

export default Codic;
