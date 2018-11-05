import AT from './activity-type';

export default function at(timesheet) {
  this.type = AT.ONCE;
  this.timesheet = timesheet;
  return this.save();
}
