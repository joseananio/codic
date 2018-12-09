import hi from "human-interval";

interface generateTimeFunc {
  (timesheet: string | number): number;
}
export const generateTime: generateTimeFunc = timesheet => {
  if (!timesheet)
    throw new TypeError("timesheet should be string or millisecs int");
  return typeof timesheet === "number" ? timesheet : hi(timesheet);
  // timesheet = timesheet.toString();
  // if (/^[0-9]+$/.test(timesheet)) return parseInt(timesheet);
  // return hi(timesheet);
};
