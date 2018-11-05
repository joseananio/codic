export default function(task) {
	// if(!(task instanceof Job)) {throw "Invalid task"}
	var exists = false;
	var tasks = this.list;
	tasks.forEach(function (that,key) {
		if(that.name === task.name){
			tasks[key] = task;
			exists=true;
		}
	});

	if (!exists) tasks.push(task);
	this.list = tasks;
	return this;
};