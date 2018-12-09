import { ActivityModel } from "./constructor";
import { TaskModel } from "../task/constructor";

export default async function(): Promise<Array<any>> {
  let promisies = this.taskNames.map(
    async name => await this.driver.tasks.get(name)
  );
  let tasks = await Promise.all(promisies);
  return tasks;
}
