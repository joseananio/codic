export default async function getDueList() {
  // set up array to contain cron tasks that are ready to execute
  var __due = [];
  var now = Date.now();

  var active = await this.getActiveActivities();
  active.forEach(function(activity) {
    if (activity.isDue(now)) {
      __due.push(activity);
    }
  });
  return __due;
}
