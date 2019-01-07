var chaiAsPromised = require("chai-as-promised");
import Codic, { Task } from "../../lib/codic";
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
// chai.should();

const path = require("path");
let codic = new Codic();
/////////////////////////

let tF = function() {
  console.log("hello");
};
let definitionPath = path.join(__dirname, "./taskFunction.ts");
let taskModel = { name: "task 3", definition: tF, config: {} };

//////////////////////

describe("Codic.Assign", () => {
  it("should throw Error if name is not string", async () => {
    // @ts-ignore
    expect(codic.assign(43, tF, {})).to.eventually.be.rejectedWith(
      "Invalid Task name. Requires a string"
    );
  });
  it("should throw Error if definition is not provided", async () => {
    // @ts-ignore
    expect(codic.assign("name")).to.eventually.be.rejectedWith(
      "Assign requires at least two arguments; Name and task definition"
    );
  });
  it("should throw Error if config is not object", async () => {
    // @ts-ignore
    expect(codic.assign("name", tF, "notObj")).to.eventually.be.rejectedWith(
      "Invalid config parameter. Requires an object"
    );
  });
  it("should throw Error if definition is not function or string", async () => {
    // @ts-ignore
    expect(codic.assign("name", {}, {})).to.eventually.be.rejectedWith(
      "Invalid Job definition. Requires a function or full path to function"
    );
  });
  it("should assign task with function", async () => {
    let task = await codic.assign("name", tF, {});
    expect(task).to.be.instanceof(Task);
  });
});
