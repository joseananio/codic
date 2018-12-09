import { ActivityModel } from "./constructor";

/**
 * Returns activity formated to driver object
 * @returns ActivityModel
 */
export default function toObject(): ActivityModel {
  let model: ActivityModel = {
    id: this.id,
    _name: this._name,
    attrs: this.attrs,
    failedAt: this.failedAt,
    failReason: this.failReason,
    startedAt: this.startedAt,
    nextRun: this.nextRun,
    lastRun: this.lastRun,
    status: this.status,
    type: this.type,
    taskNames: this.taskNames
  };
  return model;
}
