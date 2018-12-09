import Tasks from "./tasks/index";
import Activities from "./activities/index";

// function Memory() {}

// var prot = Memory.prototype;

// prot.tasks = new Tasks();
// prot.activities = new Activities();

// Memory.prototype = prot;

class Memory {
  tasks = new Tasks();
  activities = new Activities();
}

export default Memory;
