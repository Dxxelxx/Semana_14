import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

/* ================================================
   🔹 MÓDULO 1: PEOPLE (personas)
================================================= */
let people = [
  { id: 1, name: "James", email: "j@correo.com", role: "Dev" },
  { id: 2, name: "Maria", email: "maria@correo.com", role: "QA" },
];

const peopleRouter = express.Router();

// GET /api/v1/people -> Lista todas las personas
peopleRouter.get("/", (req, res) => res.json(people));

// GET /api/v1/people/:id -> Obtiene una persona
peopleRouter.get("/:id", (req, res) => {
  const person = people.find((p) => p.id == req.params.id);
  if (!person)
    return res.status(404).json({ message: "Persona no encontrada" });
  res.json(person);
});

// POST /api/v1/people -> Crea una persona
peopleRouter.post("/", (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role)
    return res.status(400).json({ message: "Faltan datos en la solicitud" });

  const id = people.length ? people[people.length - 1].id + 1 : 1;
  people.push({ id, name, email, role });
  res.status(201).json({ message: "Persona creada" });
});

// PUT /api/v1/people/:id -> Actualiza una persona
peopleRouter.put("/:id", (req, res) => {
  const { role } = req.body;
  const person = people.find((p) => p.id == req.params.id);
  if (!person)
    return res.status(404).json({ message: "Persona no encontrada" });
  if (role) person.role = role;
  res.json({ message: "Persona actualizada" });
});

// DELETE /api/v1/people/:id -> Elimina una persona
peopleRouter.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const exists = people.some((p) => p.id === id);
  if (!exists)
    return res.status(404).json({ message: "Persona no encontrada" });

  people = people.filter((p) => p.id !== id);
  res.json({ message: "Persona eliminada" });
});

app.use("/api/v1/people", peopleRouter);

/* ================================================
   🔹 MÓDULO 2: PROJECTS (proyectos)
================================================= */
let projects = [
  {
    id: 1,
    name: "Plataforma Educativa",
    description: "Sistema de cursos online",
  },
];

const baseProjects = "/api/v1/projects";

// GET /projects
app.get(baseProjects, (req, res) => res.json(projects));

// GET /projects/:id
app.get(`${baseProjects}/:id`, (req, res) => {
  const project = projects.find((p) => p.id === parseInt(req.params.id));
  if (!project)
    return res.status(404).json({ message: "Proyecto no encontrado" });
  res.json(project);
});

// POST /projects
app.post(baseProjects, (req, res) => {
  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).json({ message: "Faltan datos del proyecto" });

  const newProject = {
    id: projects.length ? projects[projects.length - 1].id + 1 : 1,
    name,
    description,
  };
  projects.push(newProject);
  res.status(201).json({ message: "Proyecto creado" });
});

// PUT /projects/:id
app.put(`${baseProjects}/:id`, (req, res) => {
  const { name } = req.body;
  const project = projects.find((p) => p.id === parseInt(req.params.id));
  if (!project)
    return res.status(404).json({ message: "Proyecto no encontrado" });
  if (name) project.name = name;
  res.json({ message: "Proyecto actualizado" });
});

// DELETE /projects/:id
app.delete(`${baseProjects}/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Proyecto no encontrado" });
  projects.splice(index, 1);
  res.json({ message: "Proyecto eliminado" });
});

/* ================================================
   🔹 MÓDULO 3: TASKS (tareas)
================================================= */
let tasks = [
  {
    id: 1,
    title: "Diseñar UI",
    description: "Pantalla principal",
    status: "todo",
    projectId: 1,
    assignedTo: 1,
  },
];

const baseTasks = "/api/v1/tasks";

// GET /tasks -> Lista todas las tareas
app.get(baseTasks, (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id -> Obtiene una tarea
app.get(`${baseTasks}/:id`, (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task)
    return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(task);
});

// POST /tasks -> Crea una nueva tarea
app.post(baseTasks, (req, res) => {
  const { title, description, projectId, assignedTo } = req.body;
  if (!title || !description || !projectId)
    return res.status(400).json({ message: "Faltan campos obligatorios" });

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    status: "todo",
    projectId,
    assignedTo: assignedTo || null,
  };

  tasks.push(newTask);
  res.status(201).json({ message: "Tarea creada" });
});

// PUT /tasks/:id -> Actualiza una tarea
app.put(`${baseTasks}/:id`, (req, res) => {
  const { status } = req.body;
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task)
    return res.status(404).json({ message: "Tarea no encontrada" });

  if (status) task.status = status;
  res.json({ message: "Tarea actualizada" });
});

// DELETE /tasks/:id -> Elimina una tarea
app.delete(`${baseTasks}/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  const exists = tasks.some((t) => t.id === id);
  if (!exists)
    return res.status(404).json({ message: "Tarea no encontrada" });

  tasks = tasks.filter((t) => t.id !== id);
  res.json({ message: "Tarea eliminada" });
});

/* ================================================
   🔹 Servidor principal
================================================= */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log("📚 Rutas disponibles:");
  console.log("➡ /api/v1/people");
  console.log("➡ /api/v1/projects");
  console.log("➡ /api/v1/tasks");
});