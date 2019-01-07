var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import Activity from "../../../lib/codic/activity";
import { driver } from "../helper.test";

//////////////////////////


describe("Memory.Activities", () => {
  it("should create new activity with activity array", () => {
    let activity = new Activity(["activity 1"], { driver });
    expect(activity).to.respondTo("toObject");
  });

  it("should create new activity with activity string", () => {
    let activity = new Activity("activity 1", { driver });
    expect(activity).to.respondTo("toObject");
  });
  it("should save activity to driver", async () => {
    let activity = new Activity("activity 1", { driver });
    await activity.save();
    expect(activity.id).to.be.not.null;
  });

  describe("Saving to driver", () => {
    it("should save activity to driver", async () => {
      let activity = new Activity("activity 1", { driver });
      await activity.save();
      activity.setName("Activity 1");
      expect(activity._name).to.eq("Activity 1");
    });
  });
});
