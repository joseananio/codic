# codic

Codic is a simple node based library. The goal is to allow creating schedules that work with any database, through drivers.

Anyone can write a driver for any database or storage mechanism to work with Codic in managing schedules.

Currently, we support redis and in-memory storage of schedules. Contributions are welcome. We will soon publish more details on how to contribute. Now, you can just contact me.


### Installation
---
```
npm install --save codic
```
or
```
yarn install codic
```
### Usage
In your code, do the following:
```javascript
import Codic from "codic";
import RedisDriver from "codic-redis";// or any other driver, or your own driver

//instatiate driver and codic
var driver = new RedisDriver();
var codic = new Codic(driver);

// define your tasks
const simpleLogTask = (activity) => {
    console.log("Simply logging");
}
// use an IIFE, for async database activities
(async function(){

    try {
        // register task on Codic
        await codic.assign("log something",{},simpleLogTask);

        //create the activities that run the tasks
        await codic
            .run("log something")
            .every(3) //3 seconds
            .use({message:"Hello"})
            .save();

        //start codic
        await codic.start();
    }
});
```
Thats it. You are live!!

### Concept
----
Codic works on two main pillars:
1. Activity
2. Task
#### Activities
Activities as the name suggests, are the things you want to do at a particular time.
#### Tasks 
An activity can contain a number of tasks that will be completed

So when a scheduled activity is executed, it will run one or more tasks before it ends. This is a bit different from existing schedulers that only let you create jobs and pass in functions.


