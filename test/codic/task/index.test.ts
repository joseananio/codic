var chaiAsPromised = require("chai-as-promised");
import Task from "../../../lib/codic/task";
import chai, { expect } from "chai";
chai.use(chaiAsPromised);
chai.should();

const path = require("path");

/////////////////////////

let tF = function() {
  console.log("hello");
};
let definitionPath = path.join(__dirname, "./taskFunction.ts");
let taskModel = { name: "task 3", definition: tF, config: {} };

//////////////////////

describe("Codic.Task", () => {
  describe("Creating Codic Task", () => {
    it("should create a new task by name and function", () => {
      const task = new Task("task 1", tF);
      expect(task).to.respondTo("toObject");
      expect(task).to.haveOwnProperty("name");
      expect(task).to.haveOwnProperty("_definition");
      expect(task._definition).to.eq(tF);
    });

    it("should create a new task by name and function file path", () => {
      const task = new Task("task 2", definitionPath);
      expect(task).to.respondTo("toObject");
      expect(task).to.haveOwnProperty("name");
      expect(task).to.haveOwnProperty("_definition");
    });

    describe("When Using TaskModel", () => {
      it("should create new task by TaskModel", () => {
        const task = new Task(taskModel);
        expect(task).to.respondTo("toObject");
        expect(task).to.haveOwnProperty("name");
        expect(task._definition).to.equal(tF);
        expect(task.config).to.haveOwnProperty("status");
      });
    });
  });

  describe("Methods", () => {
    it("should return task model", () => {
      const task = new Task(taskModel);
      let _model = task.toObject();
      expect(_model.name).to.eq(taskModel.name);
      expect(_model.definition).to.eq(taskModel.definition);
      expect(_model.config).to.contain(taskModel.config);
    });
  });
});
