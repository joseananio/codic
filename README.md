# codic

Codic is a simple node based library. The goal is to allow creating schedules that work with any database, through drivers.

Anyone can write a driver for any database or storage mechanism to work with Codic in managing schedules.

Currently, we support redis and in-memory storage of schedules. Contributions are welcome. We will soon publish more details on how to contribute. Now, you can just contact me.


### Installation
---
We are still in beta mode so beta versions should be preferred where available
```
npm install --save codic@beta
```
or
```
yarn add codic@beta
```

Install a driver library of your choice.
Currently [codic-redis](http://github.com/joseananio/codic-redis) is available. Anyone can write a driver and let us know to link it here.

```
yarn add codic-redis
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
    console.log("Simply saying "+activity.attrs.data.message);
}
// use an IIFE, for async database activities
(async function(){

    try {
        // register task on Codic
        await codic.assign("say hello",simpleLogTask);

        //create the activities that run the tasks
        await codic
            .run("say hello")
            .every("3 seconds") // or simply 3
            .use({ message:"Hello" }) //pass data to the task(s)
            .from("2018-12-12") // when to start from (optional)
            .name("some_activity_name") //optional
            .save();

        //start codic
        await codic.start();
    } catch (error) {
    console.log(error);
  }
})();
```
Thats it. You are live!!
You can create many activities that run the same ```say hello``` task(function)

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


