import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { SimpleTask } from "./SimpleTask.js";
import { ComplexTask } from "./ComplexTask.js";
import { TaskManager } from "./TaskManager.js";

const manager = new TaskManager();
const interfaceReader = createInterface({ input, output });
const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completada" },
];

const askRequiredText = async (label) => {
  while (true) {
    const value = (await interfaceReader.question(`${label}: `)).trim();
    if (value) return value;
    console.log("Este campo no puede quedar vacío.");
  }
};

const askHours = async () => {
  while (true) {
    const value = (
      await interfaceReader.question("Tiempo estimado en horas: ")
    ).trim();
    const hours = Number(value);
    if (value && Number.isFinite(hours) && hours >= 0) return hours;
    console.log("Ingresa un número mayor o igual a cero.");
  }
};

const selectStatus = async () => {
  console.log("\nEstados disponibles:");
  statusOptions.forEach(({ label }, index) =>
    console.log(`${index + 1}. ${label}`),
  );
  while (true) {
    const choice = (
      await interfaceReader.question("Selecciona un estado: ")
    ).trim();
    const selected = statusOptions[Number(choice) - 1];
    if (/^[1-3]$/.test(choice) && selected) return selected.value;
    console.log("Selecciona una opción del 1 al 3.");
  }
};

const selectTask = async (tasks = manager.getTasks()) => {
  if (tasks.length === 0) {
    console.log("No hay tareas disponibles para esta operación.");
    return null;
  }
  console.log("\nTareas disponibles:");
  tasks.forEach((task, index) => console.log(`${index + 1}. ${task.title}`));
  while (true) {
    const choice = (
      await interfaceReader.question("Número de tarea (0 para cancelar): ")
    ).trim();
    if (choice === "0") return null;
    const index = Number(choice) - 1;
    if (
      /^[1-9]\d*$/.test(choice) &&
      Number.isSafeInteger(index) &&
      index < tasks.length
    ) {
      return tasks[index];
    }
    console.log("Selecciona una tarea válida.");
  }
};

const readTaskData = async () => {
  const title = await askRequiredText("Título");
  const description = await askRequiredText("Descripción");
  const owner = await askRequiredText("Responsable");
  return { title, description, owner };
};

const addSimpleTask = async () => {
  console.log("\n--- CREAR TAREA SIMPLE ---");
  const { title, description, owner } = await readTaskData();
  const hours = await askHours();
  manager.addTask(new SimpleTask(title, description, owner, hours));
  console.log("Tarea simple registrada correctamente.");
};

const addComplexTask = async () => {
  console.log("\n--- CREAR TAREA COMPLEJA ---");
  const { title, description, owner } = await readTaskData();
  manager.addTask(new ComplexTask(title, description, owner));
  console.log("Tarea compleja registrada correctamente.");
};

const addSubTask = async () => {
  console.log("\n--- AGREGAR SUBTAREA ---");
  const complexTasks = manager
    .getTasks()
    .filter((task) => task instanceof ComplexTask);
  const parentTask = await selectTask(complexTasks);
  if (!parentTask) return;
  const { title, description, owner } = await readTaskData();
  if (parentTask.subTasks.some((task) => task.title === title)) {
    throw new Error(
      "Ya existe una subtarea con ese título dentro de esta tarea.",
    );
  }
  const hours = await askHours();
  parentTask.addSubTask(new SimpleTask(title, description, owner, hours));
  console.log(
    `Subtarea agregada. Tiempo total: ${parentTask.getTotalTime()} horas.`,
  );
};

const listTasks = () => {
  console.log("\n--- LISTADO DE TAREAS ---");
  manager.listTasks();
};

const filterTasks = async () => {
  console.log("\n--- FILTRAR POR ESTADO ---");
  const status = await selectStatus();
  const tasks = manager.filterByStatus(status);
  if (tasks.length === 0) {
    console.log("No hay tareas con ese estado.");
    return;
  }
  tasks.forEach((task) => console.log(task.toString()));
};

const showSummary = () => {
  console.log("\n--- RESUMEN DE TAREAS ---");
  const summary = manager.getSummary();
  if (summary.length === 0) {
    console.log("No hay tareas registradas.");
    return;
  }
  summary.forEach((item) => console.log(item));
};

const updateStatus = async () => {
  console.log("\n--- CAMBIAR ESTADO ---");
  const task = await selectTask();
  if (!task) return;
  const status = await selectStatus();
  task.changeStatus(status);
  console.log(`Estado actualizado: ${task.toString()}`);
};

const completeTask = async () => {
  console.log("\n--- COMPLETAR TAREA ---");
  const task = await selectTask();
  if (!task) return;
  manager.completeTask(task.title);
  console.log(`La tarea "${task.title}" se completó correctamente.`);
};

const showDetails = async () => {
  console.log("\n--- DETALLE DE TAREA ---");
  const task = await selectTask();
  if (!task) return;
  console.log(task.toString());
  if (task instanceof ComplexTask) {
    if (task.subTasks.length === 0) {
      console.log("Esta tarea todavía no tiene subtareas.");
    } else {
      console.log("Subtareas:");
      task.subTasks.forEach((subTask, index) =>
        console.log(`${index + 1}. ${subTask.toString()}`),
      );
    }
    console.log(`Tiempo total estimado: ${task.getTotalTime()} horas.`);
  }
};

const actions = {
  1: addSimpleTask,
  2: addComplexTask,
  3: addSubTask,
  4: listTasks,
  5: filterTasks,
  6: showSummary,
  7: updateStatus,
  8: completeTask,
  9: showDetails,
};

const showMenu = () => {
  console.log(`
========== GESTIÓN DE TAREAS ==========
1. Crear tarea simple
2. Crear tarea compleja
3. Agregar subtarea
4. Listar todas las tareas
5. Filtrar por estado
6. Mostrar resumen
7. Cambiar estado
8. Completar tarea
9. Ver detalle y subtareas
0. Salir
=======================================`);
};

const main = async () => {
  console.log("Bienvenido al sistema de gestión de tareas personales.");
  try {
    while (true) {
      showMenu();
      const choice = (
        await interfaceReader.question("Selecciona una opción: ")
      ).trim();
      if (choice === "0") {
        console.log("Menú cerrado.");
        break;
      }
      const action = actions[choice];
      if (!action) {
        console.log("Opción no válida. Intenta nuevamente.");
        continue;
      }
      try {
        await action();
      } catch (error) {
        console.log(`No se pudo completar la operación: ${error.message}`);
      }
    }
  } finally {
    interfaceReader.close();
  }
};

main().catch((error) => {
  console.error(`La aplicación terminó por un error: ${error.message}`);
  process.exitCode = 1;
});
