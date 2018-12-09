import { TaskModel } from "../../codic/task/constructor";
interface saveFunc {
    (task: TaskModel): Promise<TaskModel>;
}
/**
 * Save task into memory and driver
 * Tasks are saved automatically to driver always
 * Updates if name exists
 * @param {TaskModel} task task model object
 * @returns Promise<TaskModel>
 */
declare let save: saveFunc;
export default save;
