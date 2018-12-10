import { ACodic, IACodic } from "./constructor";
import Activity from "./activity/index";
import Task from "./task/index";
import { TaskModel, TaskDefinition, TaskConfig } from "./task/constructor";
interface ICodic extends IACodic {
    run(jobs: string | Array<string>, ...rest: any): Promise<Activity>;
    assign(name: string | TaskModel, def: string | TaskDefinition, config?: TaskConfig): Promise<Task>;
    start(): Promise<void>;
    pause(): Promise<Codic>;
}
declare class Codic extends ACodic implements ICodic {
    /**
     * Create a new activity. Activity requires a list of tasks,
     * time schedule and optional input data
     * @param tasks list of tasks (jobs) to run
     * @param rest other parameter
     */
    run(tasks: string | Array<string>, ...rest: any): Promise<Activity>;
    /**
     * Create a new task that will be executed by activities
     * @param name task name
     * @param definition task definition. The whole function or path to the defined task function
     * @param config optional configurations for task
     */
    assign(name: string | TaskModel, definition: string | TaskDefinition, config?: TaskConfig): Promise<Task>;
    /**
     * Start codic
     */
    start(): Promise<void>;
    /**
     * Pause codic
     * @param activityName optional. pause a specific activity only
     */
    pause(activityName?: string): Promise<Codic>;
    /**
     * private method
     * @param cb callback function
     */
    private _runThrough;
    /**
     * Private method
     */
    private _tryRun;
}
export default Codic;
export { default as Task } from "./task/index";
export { default as Activity } from "./activity/index";
