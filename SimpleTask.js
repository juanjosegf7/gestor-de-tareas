import { Task } from "./Task.js";

export class SimpleTask extends Task {
  constructor(title, description, owner, estimatedHours, status = "pending") {
    super(title, description, owner, status);
    if (!Number.isFinite(estimatedHours) || estimatedHours < 0) {
      throw new Error(
        "El tiempo estimado debe ser un número válido y no negativo.",
      );
    }
    this.estimatedHours = estimatedHours;
  }

  toString() {
    return `${super.toString()} | Tiempo estimado: ${this.estimatedHours} ${this.estimatedHours === 1 ? "hora" : "horas"}`;
  }
}
