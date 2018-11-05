import { Tasks } from "./constructor";
import save from "./add";
import get from "./get";

Tasks.prototype = {
  save,
  get
};

export default Tasks;
