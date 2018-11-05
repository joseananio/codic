function Activities() {
  this.list = [];
  //read from storage
}
Activities.prototype.save = function(activity) {
//   console.log("create activity", activity.id, activity.timesheet);
  // if(!(activity instanceof Activity)) {throw "Invalid activity"}
  if (this.list.find(x => x.id === activity.id))
    this.list = this.list.filter(
      item => (item.id === activity.id ? activity : item)
    );
  else this.list = [...this.list, activity];
};

Activities.prototype.all = function() {
  return this.list;
};

Activities.prototype.active = function() {
  return this.list.filter(activity => activity.isActive());
};

Activities.prototype.getNextRunDelay = function() {
  var dt = null;
  var now = Date.now();
  this.active().forEach(activity=> {
	  var nR = activity.nextRun;
	  if (!dt) dt = nR;
	  else dt = nR <dt ? nR : dt;
	});
  return Math.ceil((dt-now)/1000)*1000;
};

Activities.prototype.getDueList = function() {
  // set up array to contain cron tasks that are ready to execute
  var __due = [];
  var now = Date.now();

  this.active().forEach(function(activity) {
    if (activity.isDue(now)) {
      __due.push(activity);
    }
  });
  return __due;
};

export default Activities;
