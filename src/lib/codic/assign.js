import Task from "../task";

export default async function assign(name) {
  var config = {};
  var def;
  if (arguments.length < 2) {
    throw "Assign requires at least two arguments; Name and task definition";
  }
  if (arguments.length === 2) def = arguments[1];
  else if (arguments.length === 3) {
    config = arguments[1];
    def = arguments[2];
  }

  if (typeof name !== "string") {
    throw "Invalid Task name. Requires a string";
  }
  if (typeof def !== "function") {
    throw "Invalid Job definition. Requires a function";
  }
  if (typeof config !== "object") {
    throw "Invalid config parameter. Requires an object";
  }

  var task = new Task(name, config, def);
  return await this.driver.saveTask(task);
}
