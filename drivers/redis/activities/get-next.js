export default async function getNextRunDelay() {
  var dt = null;
  var now = Date.now();
  var list = await this.getActiveActivities();
  list.forEach(activity => {
    var nR = activity.nextRun;
    if (!dt) dt = nR;
    else dt = nR < dt ? nR : dt;
  });
  return Math.ceil((dt - now) / 1000) * 1000;
}
