var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import Activity from "../../../lib/codic/activity";

/////////////////////////
import { driver, activity1, activity2 } from "../helper.test";
/////////////////////

async function init() {
  await driver.activities.save(activity1);
  await driver.activities.save(activity2);
}

/////////////////////

describe("Memory.Activities", () => {
  describe("Fetching Activity lists", () => {
    it("should return two items", async () => {
      await init();
      var result = await driver.activities.all();
      expect(Array.isArray(result)).to.be.true;
      result.should.have.lengthOf(2);
    });
  });

  context("When activities are cleared", () => {
    it("should return empty array", async function() {
      await init();
      var itemsCleared = await driver.activities.clear();
      var activities = await driver.activities.all();
      expect(Array.isArray(activities)).to.be.true;
      expect(itemsCleared).to.be.eq(2);
      activities.should.have.lengthOf(0);
    });
  });

  describe("Fetching Single Activity", () => {
    it("should return raw task object", async () => {
      await init();
      // let activity3 = Object.assign({}, activity1, {});
      // await activity3.setName("act3");
      // await driver.activities.save(activity3);
      var res = await driver.activities.get("act2");
      expect(Array.isArray(res.taskNames)).to.be.true;
      expect(new Activity(res, {})).to.be.instanceOf(Activity);
    });
    describe("When task name not found", () => {
      it("should return null", async () => {
        await init();
        var task = await driver.activities.get("unknown task");
        expect(task).to.be.null;
      });
    });
  });
});
