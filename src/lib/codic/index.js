import { Codic } from "./constructor";
import start from "./start";
import run from "./run";
import assign from "./assign";
import pause from "./pause"; //pause
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

export default Codic;
