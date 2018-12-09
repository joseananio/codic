var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import MemoryDriver from "../../../lib/memory";
import Task from "../../../lib/codic/task";

/////////////////////////

const driver = new MemoryDriver();

const taskFn = function() {
  console.log("Hello runner...");
};

const task1 = new Task("task one", taskFn, { priority: 1 });
const task2 = new Task("task two", taskFn, { priority: 13 });

/////////////////////

after("All savings", () => {
  driver.tasks.clear();
});

beforeEach("Running test", async () => {
  driver.tasks.clear();
  await driver.tasks.save(task1);
  await driver.tasks.save(task2);
});

/////////////////////

describe("Memory.Tasks", () => {
  describe("Fetching Task lists", () => {
    it("should return two items", async () => {
      var result = await driver.tasks.all();
      expect(Array.isArray(result)).to.be.true;
      result.should.have.lengthOf(2);
    });
  });

  context("When tasks are cleared", () => {
    it("should return empty array", async function() {
      var itemsCleared = await driver.tasks.clear();
      var tasks = await driver.tasks.all();
      expect(Array.isArray(tasks)).to.be.true;
      expect(itemsCleared).to.be.eq(2);
      tasks.should.have.lengthOf(0);
    });
  });

  describe("Fetching Single Task", () => {
    it("should return raw task object", async () => {
      var task = await driver.tasks.get("task one");
      expect(typeof task.definition).to.be.eq("function");
      expect(typeof task.name).to.be.eq("string");
      expect(task).to.be.instanceOf(Task);
    });
    describe("When task name not 2", () => {
      it("should return undefined", async () => {
        var task = await driver.tasks.get("unkown task");
        expect(task).to.be.undefined;
      });
    });
  });
});
