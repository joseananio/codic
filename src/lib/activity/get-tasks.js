export default async function() {
    var res = await Promise.all(
        await this.tasks.map(async name=> {
            var task = await this.driver.getTask(name);
            task = { ...task, activity: this };
            return task;
        })
    );
  return res;
};