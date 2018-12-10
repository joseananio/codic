import Activity from ".";
/**
 * specify when to start activity
 * @param {string|int} dateTime datetime as Date, milliseconds or string
 */
export declare function startAt(dateTime: Date | number | string): Activity;
export declare function startIn(timesheet: string): Activity;
