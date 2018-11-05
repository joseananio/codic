import Tasks from "./tasks";
import Activities from "./activities";
import Activity from '../../lib/activity';
import Task from '../../lib/task';


//////////////
var JSONfn;
if (!JSONfn) {
    JSONfn = {};
}

(function () {
  JSONfn.stringify = function(obj) {
    return JSON.stringify(obj,function(key, value){
            return (typeof value === 'function' ) ? value.toString() : value;
        });
  }

  JSONfn.parse = function(str) {
    return JSON.parse(str,function(key, value){
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
  }
}());
////////////////////

import Redis from "ioredis";

function createTask(task) {
  let { name, definition, ...config } = task;
  return new Task(name, config,definition);
}

function createActivity(activity) {
  let { jobs, ...config } = activity;
  return new Activity(jobs, config);
}

function Red(config = null) {
  this.db = new Redis(config);
  this.keyBase = "codi";
  console.log("redis");
}

Red.prototype.getActivitiesRaw = async function() {
  var res = await this.db.get(this.keyBase + ":activity");
  return res ? JSON.parse(res) : [];
};  

Red.prototype.getActivities = async function() {
  var res = await this.getActivitiesRaw();
  // console.log(res)
  var _o = res.map(activity => {
    return createActivity(activity);
  });
  return _o;
};

Red.prototype.saveActivity = async function(activity) {
  var current = await this.getActivitiesRaw();
  var exist = current.find(
    x =>
      x.timesheet === activity.timesheet &&
      JSON.stringify(x.jobs) == JSON.stringify(activity.jobs)
  );

  if (!exist) current.push(activity);
  else current = current.map(x => (x.id === activity.id ? activity : x));

  return await this.db.set(this.keyBase + ":activity", JSON.stringify(current));
};

Red.prototype.active = async function() {
  var r = await this.getActivities();
  r = r.filter(x => x.isActive());
  return r;
};
//  var _tasks=[]
Red.prototype.saveTask = async function(task) {
  var _tasks = await this.getTasks();
  var exist = _tasks.find(x => x.name === task.name);
  if (exist) {
    _tasks = _tasks.map(x => (x.name === task.name ? task : x));
  } else {
    _tasks.push(task);
  }
  // console.log('set',JSONfn.stringify(_tasks))
  return await this.db.set(this.keyBase + ":task", JSONfn.stringify(_tasks));
};

Red.prototype.getTasksRaw = async function() {
  var res = await this.db.get(this.keyBase + ":task");
  // console.log('soo',res) 
  return res ? JSONfn.parse(res) : [];
};

Red.prototype.getTasks = async function() {
  var res = await this.getTasksRaw();
  var tasks = res.map(task => {
    return createTask(task);
  });
  return tasks;
};

Red.prototype.getTask = async function(name) {
  var tasks = await this.getTasks();
  return tasks.find(task => task.name === name);
};
var tasks = new Tasks();
var activities = new Activities();

function driver() {}
var red = new Red();

driver.prototype = {
  saveTask: task => red.saveTask(task),
  getTask: name => red.getTask(name),
  saveActivity: activity => red.saveActivity(activity),
  getActivities: async () => await red.active(),
  getDueActivities: () => activities.getDueList(tasks),
  getNextRunDelay: () => activities.getNextRunDelay()
};

export default driver;
