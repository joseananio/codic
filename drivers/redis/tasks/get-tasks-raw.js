import JSONfn from '../../utils/to-from-json';

export default async function getTasksRaw() {
  var res = await this.db.get(this.keyBase + ":task");
  return res ? JSONfn.parse(res) : [];
}
