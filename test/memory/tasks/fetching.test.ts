var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import Task from "../../../lib/codic/task";

import { driver, task1, task2 } from "../helper.test";

/////////////////////////
async function init() {
  await driver.tasks.save(task1.toObject());
  await driver.tasks.save(task2.toObject());
}

/////////////////////
describe("Memory.Tasks", () => {
  describe("Fetching Task lists", () => {
    it("should return two items", async () => {
      await init();
      var result = await driver.tasks.all();
      expect(Array.isArray(result)).to.be.true;
      result.should.have.lengthOf(2);
    });
  });

  context("When tasks are cleared", () => {
    it("should return empty array", async function() {
      await init();
      var itemsCleared = await driver.tasks.clear();
      var tasks = await driver.tasks.all();
      expect(Array.isArray(tasks)).to.be.true;
      expect(itemsCleared).to.be.eq(2);
      tasks.should.have.lengthOf(0);
    });
  });

  describe("Fetching Single Task", () => {
    it("should return raw task object", async () => {
      await init();
      var task = await driver.tasks.get("task one");
      expect(typeof task.definition).to.be.eq("function");
      expect(typeof task.name).to.be.eq("string");
      expect(new Task(task)).to.be.instanceOf(Task);
    });
    describe("When task name not found", () => {
      it("should return null", async () => {
        await init();
        var task = await driver.tasks.get("unknown task");
        expect(task).to.be.null;
      });
    });
  });
});
