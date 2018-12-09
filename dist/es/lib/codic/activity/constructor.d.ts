import { ActivityType, ActivityStatus } from "./enums";
import { TaskModel } from "../task/constructor";
export interface IActivityAttr {
    skipInitial?: boolean;
    data?: object;
}
export interface ActivityModel {
    driver?: any;
    id?: string | number;
    status: ActivityStatus;
    nextRun: number;
    lastRun?: number;
    failedAt?: Date;
    failReason?: string;
    startedAt?: Date;
    type: ActivityType;
    _name?: string;
    attrs: IActivityAttr;
    taskNames: Array<string>;
}
export interface IActivity {
    driver: any;
    id?: string | number;
    status: ActivityStatus;
    nextRun: number;
    lastRun: number;
    failedAt: Date;
    startedAt: Date;
    failReason: string;
    type: ActivityType;
    _name: string;
    attrs: IActivityAttr;
    timesheet: number;
}
export interface IActivityConfig {
    driver?: any;
    id?: string | number;
    status?: ActivityStatus;
    nextRun?: number;
    lastRun?: number;
    failedAt?: Date;
    failReason?: string;
    type?: ActivityType;
    _name?: string;
    attrs?: IActivityAttr;
    timesheet?: number;
    taskNames?: Array<TaskModel>;
}
export declare abstract class AActivity implements IActivity {
    driver: any;
    readonly id?: string | number;
    timesheet: number;
    status: ActivityStatus;
    nextRun: number;
    lastRun: number;
    failedAt: Date;
    startedAt: Date;
    failReason: string;
    type: ActivityType;
    _name: string;
    attrs: IActivityAttr;
    taskNames: Array<string>;
    tasks?: Array<TaskModel>;
    /**
     *
     */
    constructor(model: ActivityModel, config: IActivityConfig);
    constructor(taskNames: string | Array<string>, config: IActivityConfig);
    private _copyConfig;
    private _createTasks;
    private _createFromModel;
}
