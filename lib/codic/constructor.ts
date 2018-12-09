import MemoryDriver from "../memory/index";

export interface IACodic {
  driver?: any;
}

export class ACodic implements IACodic {
  public driver?: any;
  /**
   * Initialize codic
   * @param {CodicDriver} driver codic storage engine
   */
  constructor(driver?: any) {
    if (!driver) driver = new MemoryDriver();
    this.driver = driver;
  }
}
