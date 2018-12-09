import Activity from ".";
/**
 * Setup repetition interval for task
 * @param {String} timesheet time to repeat in miliseconds or human-readable
 * @param  any rest fn arguments
 */
export default function every(timesheet: number | string, ...rest: any): Activity;
