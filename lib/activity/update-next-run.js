export default async function updateNextRun(from) {
  this.nextRun = from + this.timesheet;
  this.lastRun = from;
  return await this.save();
}
