export default async function(id) {
  var activities = await this.getActivities();
  var activity = activities.find(activity => activity.id === id);
  return activity || null;
}
