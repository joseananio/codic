import { TaskModel } from "./constructor";

/**
 * Returns task formated to driver object
 * @returns TaskModel
 */
export default function toObject(): TaskModel {
  let model: TaskModel = {
    name: this.name,
    definition: this.definition,
    config: this.config
  };
  return model;
}
