const chaiAsPromised = require("chai-as-promised");
import chai, { expect, assert } from "chai";
chai.use(chaiAsPromised);
chai.should();

import Activities from "../../../lib/memory/activities";
import Activity from "../../../lib/codic/activity";
import Tasks from "../../../lib/memory/tasks";
import {
  ActivityType,
  ActivityStatus
} from "../../../lib/codic/activity/enums";
const path = require("path");

/////////////////////////

let driver = { activities: new Activities(), tasks: new Tasks() };

//////////////////////

describe("Codic.Activity", () => {
  describe("Creating Codic Activity", () => {
    it("should create a new activity by task Array", () => {
      const activity = new Activity(["task 1"], { driver });
      expect(activity).to.respondTo("every");
      expect(activity.taskNames).to.have.lengthOf(1);
    });

    it("should create a new activity by task string", () => {
      const activity = new Activity("task 1", { driver });
      expect(activity).to.respondTo("every");
    });

    it("new activity should have default attributes", () => {
      let data = { _name: "sds" };
      const activity = new Activity("task 1", {
        driver,
        attrs: { data },
        failReason: "SDsd"
      });
      expect(activity.type).to.eq(ActivityType.TEMP);
      expect(activity.timesheet).to.eq(60000);
      expect(activity.status).to.eq(ActivityStatus.ACTIVE);
      expect(activity.id).to.be.undefined;
      expect(activity.attrs.data).to.be.eq(data);
    });

    it("should create timesheet from human-interval", () => {
      const activity = new Activity("task 1", { driver });
      activity.every("5 minutes");
      expect(activity.timesheet).to.eq(300000);
    });

    it("should create timesheet from milliseconds date", () => {
      const activity = new Activity("task 1", { driver });
      let now = new Date().valueOf();
      activity.every(now);
      expect(activity.timesheet).to.eq(now);
    });

    it("should create repeat cycle", () => {
      const activity = new Activity("task 1", { driver });
      activity.every("5 minutes");
      expect(activity.timesheet).to.eq(300000);
      expect(activity.type).to.eq(ActivityType.REPEAT);
    });

    it("should create one time cycle", () => {
      const activity = new Activity("task 1", { driver });
      activity.at("10 minutes");
      expect(activity.timesheet).to.eq(600000);
      expect(activity.type).to.eq(ActivityType.ONCE);
    });

    it("should set start time", () => {
      const activity = new Activity("task 1", { driver });
      let next = new Date().valueOf() + 60000;
      activity.startAt("10 minutes");
      expect(activity.nextRun).closeTo(next, activity.nextRun.valueOf());
    });

    it("should disable enabled activity", async () => {
      let activity = new Activity("task 1", {
        driver,
        status: ActivityStatus.ACTIVE
      });
      // await activity.save();
      assert(activity.status === ActivityStatus.ACTIVE);
      await activity.disable();
      expect(activity.status).to.eq(ActivityStatus.DISABLED);
    });

    it("should enable disabled activity", async () => {
      const activity = new Activity("task 1", {
        driver,
        status: ActivityStatus.DISABLED
      });
      // await activity.save();
      assert(activity.status === ActivityStatus.DISABLED);
      await activity.enable();
      expect(activity.status).to.eq(ActivityStatus.ACTIVE);
    });

    it("should return activity status", () => {
      const activity = new Activity("task 1", {
        driver,
        status: ActivityStatus.DISABLED
      });
      assert(activity.status === ActivityStatus.DISABLED);
      expect(activity.isActive()).to.eq(false);
    });

    it("should set activity name", () => {
      const activity = new Activity("task 1", {
        driver
      });
      activity.setName("some name");
      expect(activity._name).to.eq("some name");
    });

    it("should set data for activity", () => {
      let data = { name: "Happi" };
      const activity = new Activity("task 1", {
        driver
      });
      activity.use(data);
      expect(activity.attrs.data).to.eq(data);
    });

    it("should set update next run time", async () => {
      let now = new Date().valueOf();
      let config = {
        driver,
        lastRun: now,
        attrs: { skipInitial: false }
      };
      const activity = new Activity("task 1", config);
      activity.every("5 minutes");
      expect(activity.lastRun).to.eq(now, "Last run is not as expected");
      await activity.save();
      await activity.updateNextRun();
      expect(activity.nextRun).to.eq(config.lastRun + 300000);
    });

    it("should set remove activity", async () => {
      const activity = new Activity("task 1", {
        driver
      });
      let res = await activity.remove();
      expect(res).to.be.true;
    });
  });
});
