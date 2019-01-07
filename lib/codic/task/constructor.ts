/////////////////////////////////////////////
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

////////////////////////

const defaultConfig: TaskConfig = {
  priority: 1,
  status: 1
};

function copyConfig(to: TaskConfig, from: TaskConfig = {}): TaskConfig {
  if (typeof from !== "object") {
    throw "Invalid config parameter. Requires an object";
  }
  if (from.priority) to.priority = from.priority;
  return to;
}

export interface IATask {
  name: string;
  id?: string | number;
  config: TaskConfig;
  _definition?: string | TaskDefinition;
}
export abstract class ATask implements IATask {
  public id: string | number;
  public config: TaskConfig = defaultConfig;
  _definition: string | TaskDefinition;
  public name: string;

  ////////////////
  //constructor
  ////////////////

  /**
   * Create a local task instance.
   * @param name name of the new task
   * @param _definition full path to task file or a function to execute
   * @param config Configuration parameters for task. If empty, default task configuration will be used
   */
  constructor(
    name: string,
    _definition: string | TaskDefinition,
    config?: TaskConfig
  );
  /**
   * Create a local task instance using a task model object.
   * @param TModel Task Model
   */
  constructor(TModel: TaskModel);
  /**
   * Create a local task instance.
   * @param name_Or_TModel name of the new task
   * @param _definition full path to task file or a function to execute
   * @param config Configuration parameters for task. If empty, default task configuration will be used
   */
  constructor(
    name_Or_TModel: string | TaskModel,
    _definition?: string | TaskDefinition,
    config?: TaskConfig
  ) {
    if (typeof name_Or_TModel === "string") {
      this.name = name_Or_TModel;
      this.definition = _definition;
      this.config = copyConfig(defaultConfig, config);
    } else this._createFromModel(name_Or_TModel);
  }

  dd(x: number): void;
  dd(x: string, y: number): void;
  dd(x: any): void {}
  /////////////////////
  // getters-setters
  /////////////////////

  set definition(definition: string | TaskDefinition) {
    if (typeof definition !== "function" && typeof definition !== "string") {
      throw "Invalid Job definition. Requires a function or full path to function";
    }
    this._definition = definition;
  }

  get definition() {
    return this._definition;
  }

  ///////////////////////
  // internals
  ///////////////////////

  private _createFromModel(model: TaskModel) {
    this.id = model.id;
    this.name = model.name;
    this.definition = model.definition;
    this.config = copyConfig(defaultConfig, model.config);
  }
}
