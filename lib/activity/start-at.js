/**
 * specify when to start activity
 * @param {string|int} dateTime datetime string or millsec int
 */
export default function startAt(dateTime) {
  this.nextRun = new Date(dateTime).valueOf();
  return this;
}
