import MemoryDriver from "../../lib/memory";
import { Task, Activity } from "../../lib/codic";

/////////////////////////

export const driver = new MemoryDriver();

const taskFn = function() {
  console.log("Hello runner...");
};

export const task1 = new Task("task one", taskFn, { priority: 1 });
export const task2 = new Task("task two", taskFn, { priority: 13 });

export const activity1 = new Activity(["task one", "task two"], { driver });
export const activity2 = new Activity(["task one"], { driver });
activity2.setName("act2");

beforeEach("Running test", async () => {
  await driver.tasks.clear();
  await driver.activities.clear();
});
