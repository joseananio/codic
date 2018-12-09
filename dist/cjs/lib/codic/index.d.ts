import { ACodic, IACodic } from "./constructor";
import Activity from "./activity/index";
import Task from "./task/index";
import { TaskModel, TaskDefinition, TaskConfig } from "./task/constructor";
interface ICodic extends IACodic {
    run(jobs: string | Array<string>, ...rest: any): Promise<Activity>;
    assign(name: string | TaskModel, def: string | TaskDefinition, config?: TaskConfig): Promise<Task>;
    start(): Promise<void>;
    pause(): Promise<Codic>;
    _runThrough(cb?: Function): Promise<void>;
}
declare class Codic extends ACodic implements ICodic {
    run(jobs: string | Array<string>, ...rest: any): Promise<Activity>;
    assign(name: string | TaskModel, def: string | TaskDefinition, config?: TaskConfig): Promise<Task>;
    start(): Promise<void>;
    pause(activityName?: string): Promise<Codic>;
    _runThrough(cb: Function): Promise<void>;
    private _tryRun;
}
export default Codic;
