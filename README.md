# codic

Codic is a simple node based library. The goal is to allow creating job schedules that work with any database, through drivers.

Anyone can write a driver for any database or storage mechanism to work with Codic in managing schedules.

Currently, we support redis and in-memory storage of schedules. Contributions are welcome. We will soon publish more details on how to contribute. Now, you can just contact me.

#### Codic v2 is here
---

We have rewritten codic to make it easy for anyone to use and build upon. Fully **Typescript**, **in-built memory driver**, and even more **tests** with **mocha** [Read more](#6-codic-v2)

[1. Installation](#1-installation)  
[2. Usage](#2-usage)  
[3. Concept](#3-concept)  
[4. More Examples](#4-more-examples)  
[5. Dynamic Tasks](#5-dynamic-tasks)  
[6. Codic v2](#6-codic-v2)  
[7. Creating Drivers](#7-creating-drivers)

### 1. Installation
---
We are still in beta mode so remember to check beta versions where available
```
npm install --save codic
```
or
```
yarn add codic
```


### 2. Usage
In your code, do the following:
```javascript
import Codic from "codic";

//instatiate codic
var codic = new Codic();

// define your tasks
const simpleLogTask = (activity) => {
    console.log("Simply saying "+activity.attrs.data.message);
}
// wrap in an IIFE, for async operation
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
use codic version ```1.0.2``` for codic-redis. It is yet to be updated to codic v2

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

### 3. Concept
----
Codic works on two main pillars:
1. Activity
2. Task
#### Activities
Activities as the name suggests, are the things you want to do at a particular time. Activities can be executed repeatedly or once.  
#### Tasks 
An activity can contain a number of tasks that will be performed. Tasks will be ranked in terms of priority  

So when a scheduled activity is executed, it will run one or more tasks before it ends. This is a bit different from existing schedulers that only let you create jobs and pass in functions.
<br>
<br>

### 4. More examples
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

#### Running with a delay
```javascript
await codic.run(["taskname"])
           .every("30 minutes")
           .startIn("5 minutes")
           .save();

```

#### Simplified activity creation
You can pass the task list, repeat time and data to the run method
```javascript
await codic.run(["task1","task2"],"30 minutes",{name:"somedata"}).save();

```

### 5. Dynamic tasks
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
<br>
<br>


### 6. Codic v2
---
#### 1. Now with native support for Typescript. 
We have rewritten the entire codic base in typescript. Now you can implement the driver interface and create your own storate driver without knowing the internals of codic. 
We have included declarations for all methods and variables. Comments will come soon, but everything is self-explanatory. More in this later

#### 2. Now with in-built memory driver
Right on the start, you get a default in-build memory driver. That means codic can work standalone if you do not supply external driver. Memory driver means your schedules won't survive a service restart.
For production use, do opt for an external persistent storage driver.

#### 3. More test coverage
Codic now comes with mocha and chai testing setup. We have included more unit tests to ensure everyting works as expected.
<br>
<br>

### 7. Creating drivers
---
Creating a codic storage driver is easy. Just implement the methods and properties on the driver interface and you are done.

#### Driver structure
The driver is just a plain object with two properties. Your driver instance should export an object as shown below.

```javascript
driver = {
    tasks:{
        //methods for handling tasks
    },
    activities:{
        // methods for handling activities
    }
}
```

#### Tasks interface
The tasks object implements the ITasks interface which is as shown below. Your tasks object should export all the methods and return the data as specified. The implementation below is taken from the in-built memory driver which implements the same methods.

```typescript
interface TaskModel {
  name: string;
  id?: string | number;
  config: TaskConfig;
  definition: string | TaskDefinition;
}

interface IATasks {
  list: Array<TaskModel>;
}
interface ITasks extends IATasks {
  all(): Promise<TaskModel>;
  get(name: string): Promise<TaskModel>;
  getById?(id: string | number): Promise<TaskModel>;
  save(activity: TaskModel): Promise<TaskModel>;
  clear(): number;
}
```
The TaskModel interface can be found in ```lib/codic/task/constructor```.


#### Activities interface
The activities interface is similar to the tasks and is as shown.
```typescript

interface ActivityModel {
  driver?: any;
  id?: string | number;
  status: ActivityStatus;
  nextRun: number;
  lastRun?: number;
  failedAt?: Date;
  failReason?: string;
  startedAt?: Date;
  type: ActivityType;
  _name?: string;
  attrs: IActivityAttr;
  taskNames: Array<string>;
}

interface IAActivities {
  list: Array<ActivityModel>;
}

interface IActivities extends IAActivities {
  all(): Promise<ActivityModel>;
  get(name: string): Promise<ActivityModel>;
  getById?(id: string | number): Promise<ActivityModel>;
  save(activity: ActivityModel): Promise<ActivityModel>;
  getActive(): Promise<Array<ActivityModel>>;
  clear(): Promise<number>;
  getDueList(): Promise<Array<ActivityModel>>;
  getNextRunDelay(): Promise<number>;
}
```
The TaskModel interface can be found in ```lib/codic/activity/constructor```.
<br>
<br>
#### Note:
* You can follow ```lib/memory``` as a sample implementation to create your driver.

* Remember to manage copies of these interfaces in your local project instead of referencing in codic.

* Namespaces shall be introduced to put things in perspective in future updates.

* Creating and managing record ids is left to you the creator of the driver. Codic mostly works with names of tasks and activities though ids are used in some cases.