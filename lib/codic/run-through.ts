import { ActivityModel } from "./activity/constructor";
import Activity from "./activity";

export default async function(cb?: Function): Promise<void> {
  var now = Date.now();
  var __due_tasks = [];

  var __due: Array<Activity> = await GetDueActivities(this.driver);
  let proms = __due.map(async activity => {
    activity = await activity.updateNextRun(now);
    var tasks = await activity.getTasks();
    __due_tasks = __due_tasks.concat(
      tasks.map(task => ({ ...task, activity }))
    );
    return tasks;
  });
  await Promise.all(proms);
  if (__due_tasks.length > 0) {
    await r(__due_tasks, cb, this.driver);
  } else {
    cb(null, await this.driver.activities.getNextRunDelay());
  }
}

function prioritize(tasks) {
  tasks.sort(function(a, b) {
    return a.priority > b.priority;
  });
  return tasks;
}

async function r(tasks: Array<any>, cb: Function, driver: any) {
  prioritize(tasks);
  var _runs = await tasks.map(async task => {
    let { activity } = task;
    if (typeof task.definition === "string") {
      try {
        var fn = require(task.definition);
        return await fn(activity);
      } catch (error) {
        await activity.failWith("Task file not found");
      }
    } else return await task.definition(activity);
  });

  return await Promise.all(_runs)
    .catch(async function(err) {
      cb(null, await driver.activities.getNextRunDelay());
    })
    .then(async function(r: any): Promise<void> {
      cb(null, await driver.activities.getNextRunDelay());
    });
}

async function GetDueActivities(driver): Promise<Array<Activity>> {
  let _due: Array<ActivityModel> = await driver.activities.getDueList();
  let __due: Array<Activity> = _due.map(
    model => new Activity(model, { driver })
  );
  return __due;
}
