# codic

Codic is a simple node based library. The goal is to allow creating job schedules that work with any database, through drivers.

Anyone can write a driver for any database or storage mechanism to work with Codic in managing schedules.

Currently, we support redis and in-memory storage of schedules. Contributions are welcome. We will soon publish more details on how to contribute. Now, you can just contact me.

### Codic 2.0 is here
---

We have rewritten codic to make it easy for anyone to use and build upon. Fully **Typescript**, **in-built memory driver**, and even more **tests** with **mocha** [Read more](#codic-2.0)


### Installation
---
We are still in beta mode so beta versions should be preferred where available
```
npm install --save codic
```
or
```
yarn add codic
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
            .startAt("2018-12-12") // when to start from (optional)
            .setName("some_activity_name") //optional
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

#### usage with external driver
Install a driver library of your choice.
Currently [codic-redis](http://github.com/joseananio/codic-redis) is available. Anyone can write a driver and let us know to link it here.
use codic version 1.0.2 for codic-redis. It is yet to be updated to codic 2.0

```
yarn add codic-redis
```

```javascript
import Codic from "codic";
//import external driver
import RedisDriver from "codic-redis";

//instatiate driver
var driver = new RedisDriver();
//instatiate codic and pass in the driver
var codic = new Codic(driver);

// ... continue as above
```

### Concept
----
Codic works on two main pillars:
1. Activity
2. Task
#### Activities
Activities as the name suggests, are the things you want to do at a particular time.
#### Tasks 
An activity can contain a number of tasks that will be completed.

So when a scheduled activity is executed, it will run one or more tasks before it ends. This is a bit different from existing schedulers that only let you create jobs and pass in functions.

### More examples
---
#### Running a one time task
```javascript
// pass isoString or human-interval or milliseconds to the at parameter
await codic.run("say hello")
           .at("2018-12-08T23:31:24.627Z") 
           .save();

await codic.start();

```

#### Naming an activity
```javascript
await codic.setName("someName").save();

```

### Dynamic tasks
Dynamic tasks can be created and executed at any point in your execution cycle. You will then be able to pass different data to the task at any point of creation.

To use dynamic tasks, define each task in a separate file and export it as default:
```javascript
// tasks/dynamic-task.js

// do your imports here if any
function dynamicTask(activity){
    // your content here
    console.log("Hello sailor");
}

module.exports=dynamicTask; //or
export default dynamicTask;
```
Register your task with codic, in your program:
```javascript
const path = require("path");
//define full path to task file
let taskPath = path.join(process.cwd(),"./tasks/dynamic-task.js");
//register
await codic.define("dynamic-task",taskPath);

```

Now you can use the task in your activities. The task content can be modified in the ``dynamic-task.js`` file and codic will always read the latest changes.
You can also create several activities that use the same task, during runtime.


### Codic 2.0
---
#### 1. Now with native support for Typescript. 
We have rewritten the entire codic base in typescript. Now you can implement the driver interface and create your own storate driver without knowing the internals of codic. 
We have included declarations for all methods and variables. Comments will come soon, but everything is self-explanatory. More in this later

#### 2. Now with in-built memory driver
Right on the start, you get a default in-build memory driver. That means codic can work standalone if you do not supply external driver. Memory driver means your schedules won't survive a service restart.
For production use, do opt for an external persistent storage driver.

#### 3. More test coverage
Codic now comes with mocha and chai testing setup. We have included more unit tests to ensure everyting works as expected.
