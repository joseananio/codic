import JSONfn from "../../../src/utils/to-from-json";

export default async function(task) {
  var _tasks = await this.getTasks();
  var exist = _tasks.find(x => x.name === task.name);
  if (exist) {
    _tasks = _tasks.map(x => (x.name === task.name ? task : x));
  } else {
    _tasks.push(task);
  }
  await this.db.set(this.keyBase + ":task", JSONfn.stringify(_tasks));
  return task;
}
