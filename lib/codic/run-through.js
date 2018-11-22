export default async function(cb) {
  var now = Date.now();
  var __due_tasks = [];

  var __due = await this.driver.getDueActivities();
  await Promise.all(
    await __due.map(async activity => {
      let t = activity.nextRun;
      activity = await activity.updateNextRun(now);
      var tasks = await activity.getTasks();
      __due_tasks = [...__due_tasks, ...tasks];
      return tasks;
    })
  );

  if (__due_tasks.length > 0) {
    await r(__due_tasks, cb, this.driver);
  } else {
    cb(null, await this.driver.getNextRunDelay());
  }
}

function prioritize(tasks) {
  tasks.sort(function(a, b) {
    return a.priority > b.priority;
  });
  return tasks;
}

async function r(tasks, cb, driver) {
  prioritize(tasks);
  var _runs = await tasks.map(async task => {
    let { activity } = task;

    if (typeof task.definition === "string") {
      try {
        var fn = require(task.definition);
        return await fn(activity);
      } catch (error) {
        console.log(error);
      }
    } else return await task.definition(activity);
  });
  return Promise.all(_runs)
    .catch(function(err) {
      cb(null, driver.getNextRunDelay());
    })
    .then((r, s) => {
      cb(null, driver.getNextRunDelay());
    });
}
