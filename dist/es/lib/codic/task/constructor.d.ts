export declare namespace Codic {
    interface ITask {
        name: string;
        id?: string | number;
        config: TaskConfig;
        _definition?: string | TaskDefinition;
    }
    let TaskModel: TaskModel;
    let TaskConfig: TaskConfig;
}
export interface TaskConfig {
    priority?: number;
    status?: number;
}
export interface TaskDefinition {
    (): void;
}
export interface TaskModel {
    name: string;
    id?: string | number;
    config: TaskConfig;
    definition: string | TaskDefinition;
}
export declare abstract class ATask {
    id: string | number;
    config: TaskConfig;
    _definition: string | TaskDefinition;
    name: string;
    /**
     * Create a local task instance using a task model object.
     * @param TModel Task Model
     */
    constructor(TModel: TaskModel);
    /**
     * Create a local task instance.
     * @param name name of the new task
     * @param _definition full path to task file or a function to execute
     * @param config Configuration parameters for task. If empty, default task configuration will be used
     */
    constructor(name: string, _definition: string | TaskDefinition, config?: TaskConfig);
    dd(x: number): void;
    dd(x: string, y: number): void;
    definition: string | TaskDefinition;
    private _createFromModel;
}
