export interface TaskConfig {
    priority?: number;
    status?: number;
}
export interface TaskDefinition {
    (activity: any): void;
}
export interface TaskModel {
    name: string;
    id?: string | number;
    config: TaskConfig;
    definition: string | TaskDefinition;
}
export interface IATask {
    name: string;
    id?: string | number;
    config: TaskConfig;
    _definition?: string | TaskDefinition;
}
export declare abstract class ATask implements IATask {
    id: string | number;
    config: TaskConfig;
    _definition: string | TaskDefinition;
    name: string;
    /**
     * Create a local task instance.
     * @param name name of the new task
     * @param _definition full path to task file or a function to execute
     * @param config Configuration parameters for task. If empty, default task configuration will be used
     */
    constructor(name: string, _definition: string | TaskDefinition, config?: TaskConfig);
    /**
     * Create a local task instance using a task model object.
     * @param TModel Task Model
     */
    constructor(TModel: TaskModel);
    dd(x: number): void;
    dd(x: string, y: number): void;
    definition: string | TaskDefinition;
    private _createFromModel;
}
