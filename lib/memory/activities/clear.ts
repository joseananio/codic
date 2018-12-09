/**
 * remove all activities
 * @returns Promise<number> number of tasks removed
 */
export default async function clear(): Promise<number> {
  var numRemoved = this.list.length;
  this.list = new Array();
  return numRemoved;
}
