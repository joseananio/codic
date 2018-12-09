var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import Activity from "../../../lib/codic/activity";
import MemoryDriver from "../../../lib/memory";
import Task from "../../../lib/codic/task";

//////////////////////////

const driver = new MemoryDriver();

const taskFn = function() {
  console.log("Hello sailor...");
};

let task = new Task("task 1", taskFn, { priority: 1 });

//////////////////////////

after("All savings", async () => {
  driver.tasks.clear();
});

describe("Memory.Activities", () => {
  it("should create new activity with task array", () => {
    let activity = new Activity(["task 1"], { driver });
    expect(activity).to.respondTo("toObject");
  });

  it("should create new activity with task string", () => {
    let activity = new Activity("task 1", { driver });
    expect(activity).to.respondTo("toObject");
  });
  it("should save activity to driver", async () => {
    let activity = new Activity("task 1", { driver });
    await activity.save();
    expect(activity.id).to.be.not.null;
  });

  describe("Saving to driver", () => {
    it("should save activity to driver", async () => {
      let activity = new Activity("task 1", { driver });
      await activity.save();
      activity.setName("Activity 1");
      expect(activity._name).to.eq("Activity 1");
    });
  });
});
