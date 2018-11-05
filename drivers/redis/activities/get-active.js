export default async function() {
  var r = await this.getActivities();
  r = r.filter(x => x.isActive());
  return r;
}
