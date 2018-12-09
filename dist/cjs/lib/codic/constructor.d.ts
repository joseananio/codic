export interface IACodic {
    driver?: any;
}
export declare class ACodic implements IACodic {
    driver?: any;
    /**
     * Initialize codic
     * @param {CodicDriver} driver codic storage engine
     */
    constructor(driver?: any);
}
