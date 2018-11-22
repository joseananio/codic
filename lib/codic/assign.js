import Task from "../task";

export default async function assign(name, def, config = {}) {
  if (arguments.length < 2) {
    throw "Assign requires at least two arguments; Name and task definition";
  }

  if (typeof name !== "string") {
    throw "Invalid Task name. Requires a string";
  }
  if (typeof def !== "function" && typeof def !== "string") {
    throw "Invalid Job definition. Requires a function or full path to function";
  }
  if (typeof config !== "object") {
    throw "Invalid config parameter. Requires an object";
  }

  var task = new Task(name, config, def);
  return await this.driver.saveTask(task);
}
