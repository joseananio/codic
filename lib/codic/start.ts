import Codic from ".";

/**
 * Start codic execution
 */
export default async function(): Promise<void> {
  let that = this;
  await this._tryRun();
}
