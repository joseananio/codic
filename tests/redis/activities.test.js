import test from "ava";
import Redis from "../../drivers/redis";
import Activity from '../../lib/activity';

let redis = new Redis();
let activity = new Activity("a job", { field: "value", driver: redis });
activity.timesheet = 3;

test.before("STARTING ACTIVITIES TEST", T => {});
test.only("should create new activity", async t => {
  const res = await redis.saveActivity(activity);
  t.is((await res) instanceof Activity, true);
});

test("should return list of raw activities", async t => {
  const res = await redis.getActivitiesRaw();
  t.is(await typeof res, "object");
});

test("should return list of activities", async t => {
  const res = await redis.getActivities();
  t.plan(2);
  t.is(await typeof res, "object");
  if (res.length == 0) t.pass();
  else {
    let item = res[0];
    t.context.activityId = item.id;
    t.is((await item) instanceof Activity, true);
  }
});

test("should get activity by id", async t => {
  const item = await redis.getActivity(t.context.activityId);
  if (item) t.is((await item) instanceof Activity, true);
  else t.is(await item, null);
});
test.skip("should remove activity", async t => {
  const res = await redis.removeActivity(activity.name);
  t.is(await res, "OK");
});

test("should remove all activities", async t => {
  t.plan(3);
  const res = await redis.dropActivities();
  const list = await redis.getActivitiesRaw();
  t.truthy(await res);
  t.is(await typeof list, "object");
  t.is(await list.length, 0);
});

test("should get due activities", async t => {
  const res = await redis.getDueActivities();
  t.is(await typeof res, "object");
});

test("should get next run delay", async t => {
  const res = await redis.getNextRunDelay();
  t.is(await typeof res, "number");
});

test.after("Activitiy tests done", t => {
  console.log("All done.");
});
