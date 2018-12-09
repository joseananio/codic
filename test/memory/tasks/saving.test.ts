var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import MemoryDriver from "../../../lib/memory";
import Task from "../../../lib/codic/task";

//////////////////////////

const driver = new MemoryDriver();

const taskFn = function() {
  console.log("Hello sailor...");
};

let task = new Task("a job", taskFn, { priority: 1 });

//////////////////////////

after("All savings", async () => {
  driver.tasks.clear();
});

describe("Tasks", () => {
  describe("Creating new task", () => {
    it("should create new Task object", async () => {
      const item = await driver.tasks.save(task);
      expect(item).instanceof(Task);
    });
  });
});
