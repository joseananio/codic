import JSONfn from '../../utils/to-from-json';

export async function getActivitiesRaw() {
  var res = await this.db.get(this.keyBase + ":activity");
  return res ? JSONfn.parse(res) : [];
}

export async function getActivities() {
  var res = await this.getActivitiesRaw();
  var _o = res.map(activity => {
    return this.recreateActivity(activity);
  });
  return _o;
}
