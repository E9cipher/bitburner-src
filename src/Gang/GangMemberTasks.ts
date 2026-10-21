import { IGangMemberTasksMetadata } from "./data/tasks";
import { IGangMemberTask } from "./GangMemberTask";

export const IGangMemberTasks: Record<string, IGangMemberTask> = {};

(function () {
  IGangMemberTasksMetadata.forEach((e) => {
    IGangMemberTasks[e.name] = new IGangMemberTask(e.name, e.desc, e.isHacking, e.isCombat, e.params);
  });
})();
