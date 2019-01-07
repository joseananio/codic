var chaiAsPromised = require("chai-as-promised");
import Codic, { Task, Activity } from "../../lib/codic";
import MemoryDriver from "../../lib/memory";
import chai, { expect } from "chai";
chai.use(chaiAsPromised);

const path = require("path");
/////////////////////////

let tF = function() {
  console.log("hello");
};
let definitionPath = path.join(__dirname, "./taskFunction.ts");
let taskModel = { name: "task 3", definition: tF, config: {} };

//////////////////////

describe("Codic", () => {
  it("should create without a driver", async () => {
    let codic = new Codic();
    expect(codic.driver).to.be.instanceof(MemoryDriver);
  });
  it("should create with a driver", async () => {
    let driver = new MemoryDriver();
    let codic = new Codic(driver);
    expect(codic.driver).to.be.instanceof(MemoryDriver);
  });
  context("Codic.Run", () => {
    it("should run activity with no time, data", async () => {
      let codic = new Codic();
      let activity = codic.run("name");
      expect(activity).to.be.instanceof(Activity);
      expect(activity.timesheet).to.be.eq(60 * 1000);
    });
    it("should run activity with time, no data", async () => {
      let codic = new Codic();
      let activity = codic.run("name").every("5 minutes");
      expect(activity).to.be.instanceof(Activity);
      expect(activity.timesheet).to.be.eq(5 * 60 * 1000);
    });

    it("should run activity with time, and data", async () => {
      let codic = new Codic();
      let activity = codic
        .run("name")
        .every("5 minutes")
        .use({ name: "string" });
      expect(activity).to.be.instanceof(Activity);
      expect(activity.attrs.data).to.be.deep.eq({ name: "string" });
    });

    it("should create activity with task,time in run", async () => {
      let codic = new Codic();
      let activity = codic.run("name", "5 minutes", { name: "sd" });
      expect(activity).to.be.instanceof(Activity);
      expect(activity.timesheet).to.be.eq(5 * 60 * 1000);
    });

    it("should create activity with task,time, data in run", async () => {
      let codic = new Codic();
      let activity = codic.run("name", "5 minutes", { name: "sd" });
      expect(activity).to.be.instanceof(Activity);
      expect(activity.timesheet).to.be.eq(5 * 60 * 1000);
      expect(activity.attrs.data).to.be.deep.eq({ name: "sd" });
    });
  });
  context("When starting", () => {
    it("should start with no activity defined", async () => {
      let codic = new Codic();
      expect(codic.start()).to.not.be.eventually.rejectedWith(Error);
    });
  });
  context("When running", () => {
    //not implemented
    it("should pause all", async () => {
      let codic = new Codic();
      expect(codic.pause()).to.eventually.be.rejectedWith("Not implemented");
    });
    it("should run immediately if not skipInitial", async () => {
      let codic = new Codic();
      let now = new Date().valueOf();
      codic.assign("name", () => {});
      let activity = await codic
        .run("name", "5 seconds")
        .config({ attrs: { skipInitial: false } })
        .save();
      await codic.start();
      expect(activity.nextRun).to.be.closeTo(now, 500);
    });
    it("should skipInitial", async () => {
      let codic = new Codic();
      let now = new Date().valueOf();
      codic.assign("name", () => {});
      let activity = await codic
        .run("name", "5 seconds")
        .config({ attrs: { skipInitial: true } })
        .save();
      await codic.start();
      expect(activity.nextRun).to.be.closeTo(now + 5000, 500);
    });
  });
});
