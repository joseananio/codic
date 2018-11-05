import Codic from './lib/codic';
import RedisDriver from "./drivers/redis";
// import MemoryDriver from "./drivers/memory";

var driver = new RedisDriver();

//tasks
const updateDeposits = function(activity, done) {
  console.log("Update deposits done---------!", activity.attrs.data);
  //   return new Promise((r,j)=>j(1))
  done();
};
const sendEmails = function(activity, done) {
  console.log("Send emails done---------!", activity.attrs.data);
  done();
};

const updateAccounts = function(activity, done) {
  console.log("updateAccounts done-------!", activity.attrs);
  //   return new Promise((r,j)=>r(1))
  done();
};

const t4 = (activity, cb) => {
  console.log("----------");
};

(async function() {
  var codic = new Codic(driver);
  try {
    // register tasks
    await codic.assign("update deposits", {}, updateDeposits);
    await codic.assign("send emails", { priority: 1 }, updateAccounts);
    await codic.assign("update accounts", { priority: 2 }, sendEmails);

    // create activities
    // codic.run("t2").at(4).every(1);
    // codic.run(["t1"], 5, { username: "John" }).save();
    await codic
      .run(["send emails", "update accounts"])
      .every(3)
      .use({ username: "Jon" })
      .save();

    // await codic
    //   .run("update deposits")
    //   .every(5)
    //   .use({ username: "Jon" })
    //   .save();

    await codic.start();
  } catch (error) {
    console.log(error);
  }
})();
