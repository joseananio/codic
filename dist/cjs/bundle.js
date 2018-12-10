'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var hi = _interopDefault(require('human-interval'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class ATasks {
    /**
     * Create a new tasks storage
     */
    constructor() {
        this.list = new Array();
    }
}

/**
 * Get a single task by name
 * @param {string} name name of task
 * @returns Promise<TaskModel>
 */
function get(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.list.find(task => task.name === name);
    });
}
/**
 * Get a single task by id
 * The task should have been saved in the driver first
 * Not yet available in memory
 * @param {string} name name of task
 * @returns Promise<TaskModel>
 */
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.list.find(task => task.id === id);
    });
}

/**
 * Returns a list of all tasks
 * @returns Promise<Array<TaskModel>>
 */
function all() {
    return __awaiter(this, void 0, void 0, function* () {
        return this.list;
    });
}

/**
 * Save task into memory and driver
 * Tasks are saved automatically to driver always
 * Updates if name exists
 * @param {TaskModel} task task model object
 * @returns Promise<TaskModel>
 */
let save = function (task) {
    return __awaiter(this, void 0, void 0, function* () {
        var exists = false;
        var tasks = this.list;
        tasks.forEach(function (_task, key) {
            if (_task.name === task.name) {
                tasks[key] = task;
                exists = true;
            }
        });
        if (!exists)
            tasks.push(task);
        this.list = tasks;
        return task;
    });
};

/**
 * remove tasks in memory only
 * @returns Promise<number> number of tasks removed
 */
function clear() {
    return __awaiter(this, void 0, void 0, function* () {
        var numRemoved = this.list.length;
        this.list = new Array();
        return numRemoved;
    });
}

class Tasks$1 extends ATasks {
    all() {
        return all.apply(this);
    }
    get(name) {
        return get.apply(this, arguments);
    }
    getById(id) {
        return getById.apply(this, arguments);
    }
    save(activity) {
        return save.apply(this, arguments);
    }
    clear() {
        return clear.apply(this);
    }
}

class AActivities {
    /**
     * Create a new activity storage
     */
    constructor() {
        this.list = new Array();
    }
}

/**
 * Returns a list of all activities
 * @returns Promise<Array<ActivityModel>>
 */
function all$1() {
    return __awaiter(this, void 0, void 0, function* () {
        return this.list;
    });
}

/**
 * Get a single activity by name
 * @param {string} name name of activity
 * @returns Promise<ActivityModel>
 */
function get$1(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.list.find(activity => activity._name === name);
    });
}
/**
 * Get a single activity by id
 * The activity should have been saved in the driver first
 * Not yet available in memory
 * @param {string} name name of activity
 * @returns Promise<ActivityModel>
 */
function getById$1(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.list.find(activity => activity.id === id);
    });
}

/**
 * Save activity into memory and driver
 * Tasks are saved automatically to driver always
 * Updates if name exists
 * @param {ActivityModel} activity activity model object
 * @returns Promise<ActivityModel>
 */
let save$1 = function (activity) {
    return __awaiter(this, void 0, void 0, function* () {
        var exists = false;
        var activities = this.list;
        activities.forEach(function (_activity, key) {
            if (_activity._name === activity._name) {
                activities[key] = activity;
                exists = true;
            }
        });
        if (!exists) {
            activity.id = activities.length + 1;
            activities.push(activity);
        }
        this.list = activities;
        return activity;
    });
};

/**
 * remove all activities
 * @returns Promise<number> number of tasks removed
 */
function clear$1() {
    return __awaiter(this, void 0, void 0, function* () {
        var numRemoved = this.list.length;
        this.list = new Array();
        return numRemoved;
    });
}

/**
 * Lets manage the type of activity here for now
 */
var ActivityType;
(function (ActivityType) {
    ActivityType[ActivityType["REPEAT"] = 0] = "REPEAT";
    ActivityType[ActivityType["ONCE"] = 1] = "ONCE";
    ActivityType[ActivityType["TEMP"] = 2] = "TEMP";
})(ActivityType || (ActivityType = {}));
/**
 * Lets maintain the status of each activity here in case we have to add more
 */
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus[ActivityStatus["DISABLED"] = 0] = "DISABLED";
    ActivityStatus[ActivityStatus["ACTIVE"] = 1] = "ACTIVE";
})(ActivityStatus || (ActivityStatus = {}));

function getActive () {
    return __awaiter(this, void 0, void 0, function* () {
        let list = this.list;
        return list.filter(x => x.status === ActivityStatus.ACTIVE);
    });
}

function getDueList() {
    return __awaiter(this, void 0, void 0, function* () {
        //   var __due = [];
        var now = Date.now();
        var activeList = yield this.getActive();
        return activeList.filter(activity => isDue(activity, now));
        /* activeList.forEach(activity => {
          if (isDue(activity, now)) {
            __due.push(activity);
          }
        });
        return __due;
       */
    });
}
function isDue(activity, at) {
    return activity.nextRun - new Date(at).valueOf() <= 0;
}

function getNextRunDelay() {
    return __awaiter(this, void 0, void 0, function* () {
        var dt = null;
        var now = Date.now();
        var list = yield this.getActive();
        list.forEach(activity => {
            var nR = activity.nextRun;
            if (!dt)
                dt = nR;
            else
                dt = nR < dt ? nR : dt;
        });
        return dt - now;
    });
}

class Activities extends AActivities {
    getActive() {
        return getActive.apply(this);
    }
    all() {
        return all$1.apply(this);
    }
    get(name) {
        return get$1.apply(this, arguments);
    }
    getById(id) {
        return getById$1.apply(this, arguments);
    }
    save(activity) {
        return save$1.apply(this, arguments);
    }
    clear() {
        return clear$1.apply(this);
    }
    getDueList() {
        return getDueList.apply(this);
    }
    getNextRunDelay() {
        return getNextRunDelay.apply(this);
    }
}

// function Memory() {}
// var prot = Memory.prototype;
// prot.tasks = new Tasks();
// prot.activities = new Activities();
// Memory.prototype = prot;
class Memory {
    constructor() {
        this.tasks = new Tasks$1();
        this.activities = new Activities();
    }
}

class ACodic {
    /**
     * Initialize codic
     * @param {CodicDriver} driver codic storage engine
     */
    constructor(driver) {
        if (!driver)
            driver = new Memory();
        this.driver = driver;
    }
}

/**
 * Start codic execution
 */
function start () {
    return __awaiter(this, void 0, void 0, function* () {
        // var r = await this.driver.activities.all();
        //load tasks
        // TODO: improve loading mechanism, activity.getTasks()
        // let proms = await r.map(async activity => {
        //   activity.taskNames.forEach(async function(taskName) {
        //     let _task = await that.driver.tasks.get(taskName);
        //     if (!_task) {
        //       console.warn(taskName + " is not a valid task or does not exist");
        //     } else {
        //       activity.addTask(_task);
        //     }
        //   });
        // });
        // console.log(r);
        yield this._tryRun();
    });
}

function createTasks(taskNames) {
    if (typeof taskNames === "string" && taskNames.length > 0)
        taskNames = [taskNames];
    if (!Array.isArray(taskNames))
        throw new Error("Tasks requires array or string");
    if (taskNames.length == 0)
        throw new Error("No tasks defined for activity");
    return taskNames;
}

function copyConfig(to, from) {
    if (!from)
        return to;
    if (from.id)
        to.id = from.id;
    if (from.driver)
        to.driver = from.driver;
    if (from.attrs)
        to.attrs = copyConfig(to.attrs, from.attrs);
    Object.keys(from).forEach(key => {
        if (to[key] !== undefined)
            to[key] = from[key];
    });
    return to;
}
let defaultAttr = {
    skipInitial: true,
    data: null
};
class AActivity {
    /**
     * Create a new codic activity instance.
     * @param taskNames_model name(s) of the tasks to execute
     * @param config Configuration parameters for activity
     */
    constructor(taskNames_model, config) {
        this.timesheet = 1000;
        this.status = ActivityStatus.ACTIVE;
        this.nextRun = new Date().valueOf();
        this.lastRun = null;
        this.failedAt = null;
        this.startedAt = null;
        this.failReason = null;
        this.type = ActivityType.TEMP;
        this._name = null;
        this.attrs = defaultAttr;
        this.taskNames = new Array();
        this.tasks = new Array();
        if (config)
            this._copyConfig(config);
        if (typeof taskNames_model == "string" || Array.isArray(taskNames_model))
            this._createTasks(taskNames_model);
        else
            this._createFromModel(taskNames_model);
    }
    _copyConfig(from) {
        return copyConfig(this, from);
    }
    _createTasks(taskNames) {
        this.taskNames = createTasks(taskNames);
    }
    _createFromModel(model) {
        this._copyConfig(model);
        this._createTasks(model.taskNames);
    }
}

function updateNextRun(from) {
    return __awaiter(this, void 0, void 0, function* () {
        from = from || this.lastRun || new Date().valueOf();
        this.nextRun = from + this.timesheet;
        this.lastRun = from;
        return yield this.save();
    });
}

const generateTime = timesheet => {
    if (!timesheet)
        throw new TypeError("timesheet should be string or millisecs int");
    return typeof timesheet === "number" ? timesheet : hi(timesheet);
    // timesheet = timesheet.toString();
    // if (/^[0-9]+$/.test(timesheet)) return parseInt(timesheet);
    // return hi(timesheet);
};

/**
 * specify when to start activity
 * @param {string|int} dateTime datetime as Date, milliseconds or string
 */
function startAt(dateTime) {
    if (dateTime instanceof Date)
        this.nextRun = dateTime.valueOf();
    else {
        let inc = generateTime(dateTime);
        this.nextRun = new Date().valueOf() + inc;
    }
    return this;
}
function startIn(timesheet) {
    return startAt(timesheet);
}

function getTasks () {
    return __awaiter(this, void 0, void 0, function* () {
        let promisies = this.taskNames.map((name) => __awaiter(this, void 0, void 0, function* () { return yield this.driver.tasks.get(name); }));
        let tasks = yield Promise.all(promisies);
        return tasks;
    });
}

function isActive() {
    return this.status === ActivityStatus.ACTIVE;
}

function failWith(message, time) {
    return __awaiter(this, void 0, void 0, function* () {
        this.failReason = message;
        this.failedAt = time || new Date().valueOf();
        yield this.save();
    });
}

/**
 * Returns activity formated to driver object
 * @returns ActivityModel
 */
function toObject() {
    let model = {
        id: this.id,
        _name: this._name,
        attrs: this.attrs,
        failedAt: this.failedAt,
        failReason: this.failReason,
        startedAt: this.startedAt,
        nextRun: this.nextRun,
        lastRun: this.lastRun,
        status: this.status,
        type: this.type,
        taskNames: this.taskNames
    };
    return model;
}

function addTask(task) {
    if (!this.taskNames.includes(task.name)) {
        this.taskNames.push(task.name);
        this.tasks.push(task);
    }
    else {
        this.tasks = this.tasks.map(t => (t.name === task.name ? task : t));
    }
    return this;
}

function disable() {
    return __awaiter(this, void 0, void 0, function* () {
        this.status = ActivityStatus.DISABLED;
        return yield this.save();
    });
}

function enable() {
    return __awaiter(this, void 0, void 0, function* () {
        this.status = ActivityStatus.ACTIVE;
        return yield this.save();
    });
}

function remove() {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}

function isDue$1(at) {
    return this.nextRun - new Date(at).valueOf() <= 0;
}

/**
 *
 * @param {string} name name of activity
 */
function setName(name) {
    this._name = name;
    return this;
}

/**
 * Setup repetition interval for task
 * @param {String} timesheet time to repeat in miliseconds or human-readable
 * @param  any rest fn arguments
 */
function every(timesheet, ...rest) {
    this.type = ActivityType.REPEAT;
    this.timesheet = generateTime(timesheet);
    if (!this.nextRun)
        this.nextRun = Date.now() + this.timesheet;
    if (rest.length > 0) {
        let [data] = rest;
        return this.use(data);
    }
    return this;
}

//see
// enable
// disable
function save$2() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.driver)
            throw "Driver not found on Activitys";
        if (!this.driver.activities ||
            !this.driver.activities.save ||
            typeof this.driver.activities.save !== "function")
            throw "Driver does not implement Activities properly. save is undefined";
        let activity = yield this.driver.activities.save(this.toObject());
        this._copyConfig(activity);
        return this;
    });
}

function use(data) {
    this.attrs = Object.assign({}, this.attrs, { data });
    return this;
}

function at(timesheet) {
    this.type = ActivityType.ONCE;
    this.timesheet = generateTime(timesheet);
    return this;
}

class Activity extends AActivity {
    /**
     * Run activity at a specific time once
     * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
     */
    at(timesheet) {
        return at.apply(this, arguments);
    }
    /**
     * Pass data into the activity. Data will be used by the task during execution
     * @param data data object to pass to activity
     */
    use(data) {
        return use.apply(this, arguments);
    }
    /**
     * Run activity repeatedly at a given time interval
     * @param timesheet specify the time to run activity. Human interval, date string or time number accepted
     * @param rest others
     */
    every(timesheet, ...rest) {
        return every.apply(this, arguments);
    }
    save() {
        return save$2.apply(this);
    }
    remove() {
        return remove.apply(this);
    }
    enable() {
        return enable.apply(this);
    }
    disable() {
        return disable.apply(this);
    }
    setName(name) {
        return setName.apply(this, arguments);
    }
    startAt(dateTime) {
        return startAt.apply(this, arguments);
    }
    startIn(dateTime) {
        return startIn.apply(this, arguments);
    }
    isActive() {
        return isActive.apply(this);
    }
    isDue() {
        return isDue$1.apply(this);
    }
    getTasks() {
        return getTasks.apply(this);
    }
    updateNextRun(from) {
        return updateNextRun.apply(this, arguments);
    }
    addTask(task) {
        return addTask.apply(this, arguments);
    }
    failWtih(message, time) {
        return failWith.apply(this, arguments);
    }
    /**
     * Returns task formated as a driver object
     * @returns TaskModel
     */
    toObject() {
        return toObject.apply(this);
    }
}

function run (jobs, ...rest) {
    var activity = new Activity(jobs, { driver: this.driver });
    if (rest.length > 0) {
        let [timesheet, ...rrest] = rest;
        return activity.every(timesheet, ...rrest);
    }
    return activity;
}

////////////////////////
const defaultConfig = {
    priority: 1,
    status: 1
};
function copyConfig$1(to, from = {}) {
    if (from.priority)
        to.priority = from.priority;
    return to;
}
class ATask {
    /**
     * Create a local task instance.
     * @param name_Or_TModel name of the new task
     * @param _definition full path to task file or a function to execute
     * @param config Configuration parameters for task. If empty, default task configuration will be used
     */
    constructor(name_Or_TModel, _definition, config) {
        this.config = defaultConfig;
        if (typeof name_Or_TModel === "string") {
            this.name = name_Or_TModel;
            this.definition = _definition;
            this.config = copyConfig$1(defaultConfig, config);
        }
        else
            this._createFromModel(name_Or_TModel);
    }
    dd(x) { }
    /////////////////////
    // getters-setters
    /////////////////////
    set definition(definition) {
        if (typeof definition !== "function" && typeof definition !== "string") {
            console.log(definition, typeof definition);
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
    _createFromModel(model) {
        this.id = model.id;
        this.name = model.name;
        this.definition = model.definition;
        this.config = copyConfig$1(defaultConfig, model.config);
    }
}

/**
 * Returns task formated to driver object
 * @returns TaskModel
 */
function toObject$1() {
    let model = {
        name: this.name,
        definition: this.definition,
        config: this.config
    };
    return model;
}

class Task extends ATask {
    /**
     * Returns task formated as a driver object
     * @returns TaskModel
     */
    toObject() {
        return toObject$1.apply(this);
    }
}

function assign(name, def, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!def) {
            throw "Assign requires at least two arguments; Name and task definition";
        }
        if (typeof name !== "string") {
            throw "Invalid Task name. Requires a string";
        }
        if (typeof def !== "function" && typeof def !== "string") {
            throw "Invalid Job definition. Requires a function or full path to function";
        }
        if (config && typeof config !== "object") {
            throw "Invalid config parameter. Requires an object";
        }
        const task = new Task(name, def, config);
        yield this.driver.tasks.save(task.toObject());
        return task;
    });
}

function pause(activityName) {
    throw "Not implemented";
    // console.log(this.driver);
}

function runThrough (cb) {
    return __awaiter(this, void 0, void 0, function* () {
        var now = Date.now();
        var __due_tasks = [];
        var __due = yield GetDueActivities(this.driver);
        let proms = __due.map((activity) => __awaiter(this, void 0, void 0, function* () {
            activity = yield activity.updateNextRun(now);
            var tasks = yield activity.getTasks();
            __due_tasks = __due_tasks.concat(tasks.map(task => (Object.assign({}, task, { activity }))));
            return tasks;
        }));
        yield Promise.all(proms);
        if (__due_tasks.length > 0) {
            yield r(__due_tasks, cb, this.driver);
        }
        else {
            cb(null, yield this.driver.activities.getNextRunDelay());
        }
    });
}
function prioritize(tasks) {
    tasks.sort(function (a, b) {
        return a.priority > b.priority;
    });
    return tasks;
}
function r(tasks, cb, driver) {
    return __awaiter(this, void 0, void 0, function* () {
        prioritize(tasks);
        var _runs = yield tasks.map((task) => __awaiter(this, void 0, void 0, function* () {
            let { activity } = task;
            if (typeof task.definition === "string") {
                try {
                    var fn = require(task.definition);
                    return yield fn(activity);
                }
                catch (error) {
                    yield activity.failWith("Task file not found");
                }
            }
            else
                return yield task.definition(activity);
        }));
        return yield Promise.all(_runs)
            .catch(function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                cb(null, yield driver.activities.getNextRunDelay());
            });
        })
            .then(function (r) {
            return __awaiter(this, void 0, void 0, function* () {
                cb(null, yield driver.activities.getNextRunDelay());
            });
        });
    });
}
function GetDueActivities(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        let _due = yield driver.activities.getDueList();
        let __due = _due.map(model => new Activity(model, { driver }));
        return __due;
    });
}

class Codic extends ACodic {
    /**
     * Create a new activity. Activity requires a list of tasks,
     * time schedule and optional input data
     * @param tasks list of tasks (jobs) to run
     * @param rest other parameter
     */
    run(tasks, ...rest) {
        return run.apply(this, arguments);
    }
    /**
     * Create a new task that will be executed by activities
     * @param name task name
     * @param definition task definition. The whole function or path to the defined task function
     * @param config optional configurations for task
     */
    assign(name, definition, config) {
        return assign.apply(this, arguments);
    }
    /**
     * Start codic
     */
    start() {
        return start.apply(this);
    }
    /**
     * Pause codic
     * @param activityName optional. pause a specific activity only
     */
    pause(activityName) {
        return pause.apply(this, arguments);
    }
    /**
     * private method
     * @param cb callback function
     */
    _runThrough(cb) {
        return runThrough.apply(this, arguments);
    }
    /**
     * Private method
     */
    _tryRun() {
        let that = this;
        this._runThrough(function (err, nextRun) {
            setTimeout(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    that._tryRun();
                });
            }, nextRun);
        });
    }
}

exports.default = Codic;
exports.Task = Task;
exports.Activity = Activity;
