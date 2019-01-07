var chaiAsPromised = require("chai-as-promised");
import Codic, { Task, Activity } from "../../../lib/codic";
import MemoryDriver from "../../../lib/memory";
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

const driver = new MemoryDriver();
const path = require("path");
/////////////////////////
let task2 = { name: "task2", definition: activity => {}, config: {} };

describe("Codic.Activity.AddTask", () => {
  it("should add another task", async () => {
    let activity = new Activity("sss", { driver });
    expect(activity.taskNames).to.have.lengthOf(1);
    await activity.addTask(task2.name);
    expect(activity.taskNames).to.have.lengthOf(2);
  });
  it("should add replace if name exists task", () => {
    let activity = new Activity("task2", { driver });
    expect(activity.taskNames).to.have.lengthOf(1);
    activity.addTask(task2.name);
    expect(activity.taskNames).to.have.lengthOf(1);
  });
  it("should throw if task not string or array string", async () => {
    let activity = new Activity("task2", { driver });
    expect(activity.taskNames).to.have.lengthOf(1);
    // @ts-ignore
    let d = async () => activity.addTask(task2);
    expect(d()).to.eventually.be.rejectedWith(
      "Tasks should be array or string"
    );
  });
});
