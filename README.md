# codic

Automated processes (jobs) that work with any database, through drivers.

<p>
    <a href="https://gitter.im/joseananio/codic">
      <img src="https://img.shields.io/npm/dm/codic.svg?maxAge=2592000"/>
    </a>
    <a href="http://travis-ci.org/joseananio/codic">
      <img src="https://img.shields.io/travis/joseananio/codic/master.svg"/>
    </a>
    <a href="http://badge.fury.io/js/codic">
      <img src="https://badge.fury.io/js/codic.svg"/>
    </a>
    <a href="https://coveralls.io/github/joseananio/codic?branch=master">
      <img src="https://coveralls.io/repos/github/joseananio/codic/badge.svg?branch=master"/>
    </a>
    <a href="http://isitmaintained.com/project/joseananio/codic">
      <img src="http://isitmaintained.com/badge/open/joseananio/codic.svg"/>
    </a>
    <a href="http://isitmaintained.com/project/joseananio/codic">
      <img src="http://isitmaintained.com/badge/resolution/joseananio/codic.svg"/>
    </a>
  </p>
  <p>
Anyone can write a driver for any database or storage mechanism to work with Codic in managing schedules.

By default we support in-memory storage. There is [codic-redis](http://github.com/joseananio/codic-redis) for redis too. Contributions are welcome. We will soon publish more details on how to contribute to codic itself.

### Feature Comparison

Since there are a few job queue solutions, here a table comparing them to help you use the one that
better suits your needs.

| Feature         | Codic | Bull          | Kue   | Bee | Agenda
| :-------------  |:-----:|:-------------:|:-----:|:---:|:------:|
| Backend         |any     | redis         | redis |redis| mongo  |
| Priorities      | ✓      | ✓             |  ✓    |     |   ✓    |
| Concurrency     |        | ✓             |  ✓    |  ✓  |   ✓    |
| Delayed jobs    | ✓      | ✓             |  ✓    |     |   ✓    |
| Global events   |        | ✓             |  ✓    |     |        |
| Rate Limiter    |        | ✓             |       |     |        |
| Pause/Resume    |        | ✓             |  ✓    |     |        |
| Sandboxed worker|        | ✓             |       |     |        |
| Repeatable jobs | ✓      | ✓             |       |     |   ✓    |
| Atomic ops      | ✓      | ✓             |       |  ✓  |        |
| Persistence     | ✓      | ✓             |   ✓   |  ✓  |   ✓    |
| UI              |       | ✓             |   ✓   |     |   ✓    |
| Optimized for   | Jobs/Messages | Jobs / Messages | Jobs | Messages | Jobs |

#### Codic v2 is here
---

We have rewritten codic to make it easy for anyone to use and build upon. Fully **Typescript**, **in-built memory driver**, and even more **tests** with **mocha** [Read more](#6-codic-v2)

**Note**: You don't have to know or use typescript to develop for codic or to use codic. It works same way with regular javascript.

[Installation](#1-installation)  
[Usage](#2-usage)  
[Concept](#3-concept)  
[More Examples](#4-more-examples)  
[Dynamic Tasks](#5-dynamic-tasks)  
[Updating activities](#6-updating-activities)  
[Codic v2](#7-codic-v2)  
[Creating Drivers](#8-creating-drivers)

### Installation
---

```
npm install --save codic
```
or
```
yarn add codic
```


### Usage
Codic is easy to implement. In your code, do the following:
```javascript
import Codic from "codic";

//instatiate codic
var codic = new Codic();

// define your tasks
const simpleLogTask = (activity) => {
    console.log("Simply saying "+activity.attrs.data.message); // data will be passed in 
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
You can create many activities that run the same ```say hello``` task(function) or different tasks for the same activity.

#### Usage with external driver
Install a driver library of your choice.
Currently [codic-redis](http://github.com/joseananio/codic-redis) is available. Anyone can write a driver and let us know to link it here.
```
npm install --save codic-redis 
```
or
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
[Codic](https://github.com/joseananio/codic.git) uses Activities and Tasks to let you automate processes in your app.

#### Tasks 
A task is what you want to do at a particular time. It can be a simple function or a file exporting a function.

An activity can contain a number of tasks that will be performed. Tasks will be ranked in terms of priority  
#### Activities
Activity specifies the time and how often one or more tasks are run. They can be executed repeatedly or once.

So when a scheduled activity is executed, it will run one or more tasks before it ends. This is a bit different from existing schedulers that only let you create jobs and pass in functions.
<br>
<br>

### More examples
---
Assuming we have defined a task as follows:
```javascript
import mailer from "somepackage";
import getUsersByGroupId from "somepackage2";

await codic.assign("send notifications",async function(activity){
    let groupId = activity.attrs.data.groupId;
    let users = await getUsersByGroupId(groupId);
    let message="Report to headquarters";
    users.map(async user=>{
        await mailer.send(user.email,message);
    });
})
```
#### Running a one time task
```javascript
// pass isoString or human-interval or milliseconds to the at method
await codic.run("send notifications")
            .use({groupId:1})
           .at("2019-12-08T23:31:24.627Z") 
           .save();

await codic.start();

```

#### Naming an activity
```javascript
await codic.setName("someName").save();

```

#### Running with a delay
```javascript
// wait 5 minutes before executing activity
await codic.run(["send notifications"])
           .every("30 minutes")
           .startIn("5 minutes")
           .save();

```

#### Simplified activity creation
You can pass the task list, repeat time and data to the ```.run``` method
```javascript
await codic.run(
        ["send notifications","task2"], //tasks
        "30 minutes", //time, every("30 minutes")
        {groupId:2} //data, use({groupId:2})
      )
      .save();

```

### Dynamic tasks
Dynamic tasks can be created and executed at any point in your execution cycle. You will then be able to pass different data to the task at any point in your code.

To use dynamic tasks, define each task in a separate file and export it as default:
lets say we have
```
src/
    tasks/
        email-sender-task.js
    lib/
        email-sender.js
```
Then, in email-sender-task.js,
```javascript
// tasks/email-sender-task.js

// do your imports here if any
require const emailSender = "../lib/email-sender";

function sendEmails(activity){
    // your content here
    console.log("Sending emails");
    emailSender.sendMassEmails();
}

module.exports=dynamicTask; //or
export default dynamicTask;
```
Register your task with codic, in your app:
```javascript
const path = require("path");
//define full path to task file
let taskPath = path.join(process.cwd(),"./tasks/dynamic-task.js");
//register full path
await codic.define("send emails",taskPath);

```

Now you can use the task in your activities. The task content can be modified in the ``email-sender-task.js`` file and codic will always read the latest changes.
You can also create several activities that use the same task, during runtime.
<br>
<br>

### Updating activities
To update an activity, set a name for it during creation. You can then use the name to fetch, modify and then save the change.
```javascript
await codic.run("send emails")
           .every("year")
           .use({recipients:[
               "joe@gmail.com","doe@yahoo.com"]
            })
           .setName("annualMailsActivity");
```

then somewhere else in your app,
```javascript
let annualMA = await codic.activities.get("annualMailsActivity");
//add another recipient
let newRecipients=["joe@gmail.com","doe@yahoo.com","sam@live.com"];
annualMA.use({recipients:newRecipients});
await annualMA.save();
```
### Codic v2
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

### Creating drivers
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
  list?: Array<TaskModel>;
}
interface ITasks extends IATasks {
  getById?(id: string | number): Promise<TaskModel>;
  save(activity: TaskModel): Promise<TaskModel>;
  get(name: string): Promise<TaskModel>;
  all(): Promise<Array<TaskModel>>;
  clear(): number;
}
```
The TaskModel, TaskDefinition, TaskConfig interface can be found in ```lib/codic/task/constructor.ts```.
ITasks and IATasks interfaces can be found in ```lib/memory/tasks/constructor.ts```.


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
  list?: Array<ActivityModel>;
}

interface IActivities extends IAActivities {
  getById?(id: string | number): Promise<ActivityModel>;
  save(activity: ActivityModel): Promise<ActivityModel>;
  getDueList(): Promise<Array<ActivityModel>>;
  getActive(): Promise<Array<ActivityModel>>;
  get(name: string): Promise<ActivityModel>;
  all(): Promise<Array<ActivityModel>>;
  getNextRunDelay(): Promise<number>;
  clear(): Promise<number>;
}
```
The ActivityModel, IActivityAttr, interface can be found in ```lib/codic/activity/constructor```.
IActivities and IAActivities can be found in ```lib/memory/activities/constructor```.
ActivityType and ActivityStatus can be found in ```lib/codic/activity/enums```.
<br>
<br>
#### Note:
* You can follow ```lib/memory``` as a sample implementation to create your driver.

* Remember to manage copies of these interfaces in your local project instead of referencing in codic.

* Namespaces shall be introduced to put things in perspective in future updates.

* Creating and managing record ids is left to you the creator of the driver. Codic mostly works with names of tasks and activities though ids are used in some cases.