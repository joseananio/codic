import { Codic } from "./constructor";
import start from "./start";
import run from "./run";
import assign from "./assign";
import pause from "./pause"; //pause
import _Activity from "../activity";
import Task from "../task";
// removeActivity
// resume
import runThrough from "./run-through";

Codic.prototype = {
  pause,
  start,
  run,
  assign,
  runThrough
};
Codic.Task = Task;
Codic.Activity = _Activity;

export default Codic;
