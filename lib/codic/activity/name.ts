import Activity from ".";

/**
 *
 * @param {string} name name of activity
 */
export default function setName(name: string): Activity {
  this._name = name;
  return this;
}
