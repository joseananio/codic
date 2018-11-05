export default async function() {
  let that = this;
  var r = await this.driver.getActivities();
  await r.map(async activity => {
    activity.tasks.forEach(async function(taskName) {
      if (!(await that.driver.getTask(taskName))) {
        console.warn(taskName + " is not a valid task or does not exist");
      }
    });
  });
  await tryRun(this);
}

async function tryRun(codic) {
  codic.runThrough(function(err, nextRun) {
    setTimeout(async () => await tryRun(codic), nextRun);
  });
}
