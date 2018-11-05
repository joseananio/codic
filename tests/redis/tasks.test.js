import test from "ava";
import Redis from "../../drivers/redis";
import Task from '../../lib/task';

let task = new Task("a job", { priority: 1 }, function() {
  console.log("Hello runner...");
});

var redis = new Redis();
test("should create new task", async t => {
  const item = await redis.saveTask(task);
  t.is((await item) instanceof Task, true);
});

test("should return list of raw tasks", async t => {
  const res = await redis.getTasksRaw();
  t.is(await typeof res, "object");
});

test("should return list of tasks", async t => {
  const res = await redis.getTasks();
  let item = res.length > 0 ? res[0] : {};
  t.is((await item) instanceof Task, true);
});

test("should get task by name", async t => {
  const item = await redis.getTask(task.name);
  t.is((await item) instanceof Task, true);
});
test.skip("should remove task", async t => {
  const res = await redis.removeTask(task.name);
  t.true(await res);
});
