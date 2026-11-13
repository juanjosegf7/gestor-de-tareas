export class Task {
  static validStatuses = ["pending", "in_progress", "completed"];

  constructor(title, description, owner, status = "pending") {
    if (
      ![title, description, owner].every(
        (value) => typeof value === "string" && value.trim(),
      )
    ) {
      throw new Error(
        "El título, la descripción y el responsable deben ser textos no vacíos.",
      );
    }
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.status = "pending";
    this.changeStatus(status);
  }

  changeStatus(newStatus) {
    if (!Task.validStatuses.includes(newStatus)) {
      throw new Error(`El estado "${newStatus}" no es válido.`);
    }
    this.status = newStatus;
  }

  toString() {
    const statusLabels = {
      pending: "pendiente",
      in_progress: "en progreso",
      completed: "completada",
    };
    return `Título: ${this.title} | Descripción: ${this.description} | Responsable: ${this.owner} | Estado: ${statusLabels[this.status]}`;
  }
}
