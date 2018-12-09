export default async function updateNextRun(from?: number): Promise<any> {
  from = from || this.lastRun || new Date().valueOf();
  this.nextRun = from + this.timesheet;
  this.lastRun = from;
  return await this.save();
}
