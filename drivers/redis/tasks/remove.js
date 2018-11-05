import JSONfn from "../../../src/utils/to-from-json";

export default async function(name) {
  var tasks = await this.getTasks();
  tasks = tasks.filter(t => t.name !== name);
  await this.db.set(this.keyBase + ":task", JSONfn.stringify(tasks));
  return true;
}
