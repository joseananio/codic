'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class ATasks {
    /**
     * Create a new tasks storage
     */
    constructor() {
        this.list = new Array();
    }
}

class Tasks$1 extends ATasks {
    all() {
        return require("./all").default.apply(this);
    }
    get(name) {
        return require("./get").default.apply(this, arguments);
    }
    getById(id) {
        return require("./get").getById.apply(this, arguments);
    }
    save(activity) {
        return require("./save").default.apply(this, arguments);
    }
    clear() {
        return require("./clear").default.apply(this);
    }
}

class AActivities {
    /**
     * Create a new activity storage
     */
    constructor() {
        this.list = new Array();
    }
}

class Activities extends AActivities {
    getActive() {
        return require("./get-active").default.apply(this);
    }
    all() {
        return require("./all").default.apply(this);
    }
    get(name) {
        return require("./get").default.apply(this, arguments);
    }
    getById(id) {
        return require("./get").getById.apply(this, arguments);
    }
    save(activity) {
        return require("./save").default.apply(this, arguments);
    }
    clear() {
        return require("./clear").default.apply(this);
    }
    getDueList() {
        return require("./get-due-list").default.apply(this);
    }
    getNextRunDelay() {
        return require("./get-next-delay").default.apply(this);
    }
}

// function Memory() {}
// var prot = Memory.prototype;
// prot.tasks = new Tasks();
// prot.activities = new Activities();
// Memory.prototype = prot;
class Memory {
    constructor() {
        this.tasks = new Tasks$1();
        this.activities = new Activities();
    }
}

class ACodic {
    /**
     * Initialize codic
     * @param {CodicDriver} driver codic storage engine
     */
    constructor(driver) {
        if (!driver)
            driver = new Memory();
        this.driver = driver;
    }
}

class Codic extends ACodic {
    run(jobs, ...rest) {
        return require("./run").default.apply(this, arguments);
    }
    assign(name, def, config) {
        return require("./assign").default.apply(this, arguments);
    }
    start() {
        return require("./start").default.apply(this);
    }
    pause(activityName) {
        return require("./run").default.apply(this, arguments);
    }
    _runThrough(cb) {
        return require("./run-through").default.apply(this, arguments);
    }
    _tryRun() {
        let that = this;
        this._runThrough(function (err, nextRun) {
            setTimeout(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    that._tryRun();
                });
            }, nextRun);
        });
    }
}

module.exports = Codic;
