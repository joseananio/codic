import Codic from ".";

/**
 * Start codic execution
 */
export default async function(): Promise<void> {
  let that = this;
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
  await this._tryRun();
}
