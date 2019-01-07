var chaiAsPromised = require("chai-as-promised");
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

import Task from "../../../lib/codic/task";
import { driver, task1, task2 } from "../helper.test";

//////////////////////////

describe("Tasks", () => {
  describe("Creating new task", () => {
    it("should create new Task object", async () => {
      const item = await driver.tasks.save(task1.toObject());
      expect(new Task(item)).instanceof(Task);
    });
  });
});
