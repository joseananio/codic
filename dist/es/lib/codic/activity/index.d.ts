import { AActivity, IActivity, ActivityModel } from "./constructor";
import { TaskModel } from "../task/constructor";
interface IAActivity extends IActivity {
    every(timesheet: number | string, ...rest: any): Activity;
    startAt(dateTime: Date | string | number): Activity;
    updateNextRun(from: number): Promise<any>;
    at(timesheet: number | string): Activity;
    startIn?(dateTime: string): Activity;
    setName(name: string): Activity;
    disable(): Promise<Activity>;
    enable(): Promise<Activity>;
    use(data: object): Activity;
    remove(): Promise<boolean>;
    save(): Promise<Activity>;
    getTasks(): Promise<any>;
    isActive(): boolean;
    isDue(): boolean;
}
declare class Activity extends AActivity implements IAActivity {
    /**
     * Run activity at a specific time once
     * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
     */
    at(timesheet: number | string): Activity;
    /**
     * Pass data into the activity. Data will be used by the task during execution
     * @param data data object to pass to activity
     */
    use(data: object): Activity;
    /**
     * Run activity repeatedly at a given time interval
     * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
     * @param rest others
     */
    every(timesheet: number | string, ...rest: any): Activity;
    save(): Promise<Activity>;
    remove(): Promise<boolean>;
    enable(): Promise<Activity>;
    disable(): Promise<Activity>;
    setName(name: string): Activity;
    startAt(dateTime: Date | string | number): Activity;
    startIn(dateTime: string): Activity;
    isActive(): boolean;
    isDue(): boolean;
    getTasks(): Promise<any>;
    updateNextRun(from?: number): Promise<any>;
    addTask(task: TaskModel): Activity;
    failWtih(message: string, time?: number): Activity;
    /**
     * Returns task formated as a driver object
     * @returns TaskModel
     */
    toObject(): ActivityModel;
}
export default Activity;
