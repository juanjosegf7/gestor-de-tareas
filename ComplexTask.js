import { Task } from "./Task.js";
import { SimpleTask } from "./SimpleTask.js";

export class ComplexTask extends Task {
  constructor(title, description, owner, status = "pending") {
    super(title, description, owner, status);
    this.subTasks = [];
  }

  addSubTask(subTask) {
    if (!(subTask instanceof SimpleTask)) {
      throw new Error("Solo se pueden agregar tareas simples como subtareas.");
    }
    this.subTasks.push(subTask);
  }

  getTotalTime() {
    return this.subTasks.reduce(
      (total, subTask) => total + subTask.estimatedHours,
      0,
    );
  }

  toString() {
    return `${super.toString()} | Subtareas: ${this.subTasks.length} | Tiempo total: ${this.getTotalTime()} horas`;
  }
}
