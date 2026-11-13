import { Task } from "./Task.js";

export class TaskManager {
  #tasks = [];

  addTask(task) {
    if (!(task instanceof Task)) {
      throw new Error("Solo se pueden agregar objetos de tipo tarea.");
    }
    if (this.#tasks.some((existingTask) => existingTask.title === task.title)) {
      throw new Error(`Ya existe una tarea con el título "${task.title}".`);
    }
    this.#tasks.push(task);
  }

  getTasks() {
    return [...this.#tasks];
  }

  listTasks() {
    if (this.#tasks.length === 0) {
      console.log("No hay tareas registradas.");
      return;
    }
    this.#tasks.forEach((task) => console.log(task.toString()));
  }

  filterByStatus(status) {
    if (!Task.validStatuses.includes(status)) {
      throw new Error(`El estado "${status}" no es válido.`);
    }
    return this.#tasks.filter((task) => task.status === status);
  }

  getSummary() {
    const statusLabels = {
      pending: "pendiente",
      in_progress: "en progreso",
      completed: "completada",
    };
    return this.#tasks.map(
      ({ title, status }) =>
        `Título: ${title} | Estado: ${statusLabels[status]}`,
    );
  }

  completeTask(title) {
    const task = this.#tasks.find((currentTask) => currentTask.title === title);
    if (!task) {
      throw new Error(`No se encontró la tarea "${title}".`);
    }
    task.changeStatus("completed");
  }
}
