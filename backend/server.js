const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const client = require('prom-client'); // STEP 2: Prometheus client import

const app = express();
const PORT = process.env.PORT || 5000;

// ── Prometheus Metrics Setup ────────────────────────────────────────────────
// Is se default metrics (CPU, RAM, Event Loop) collect hona shuru ho jayenge
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// ── Logging middleware ──────────────────────────────────────────────────────
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next();
});

// ── Core middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── In-memory store ─────────────────────────────────────────────────────────
let tasks = [
  {
    id: uuidv4(),
    title: 'Set up project structure',
    description: 'Initialize the TaskBloom repository and configure tooling',
    status: 'done',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Design the dashboard UI',
    description: 'Create wireframes and implement the pastel kanban board',
    status: 'in-progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Write API integration tests',
    description: 'Cover all CRUD endpoints with automated tests',
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
];

// ── Prometheus Metrics Endpoint ─────────────────────────────────────────────
// Ye wo rasta hai jahan se Prometheus data uthayega
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// ── Health ──────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ── GET /tasks  (optional ?status= filter) ──────────────────────────────────
app.get('/tasks', (req, res) => {
  const { status } = req.query;
  const result = status ? tasks.filter(t => t.status === status) : tasks;
  res.json(result);
});

// ── POST /tasks ─────────────────────────────────────────────────────────────
app.post('/tasks', (req, res) => {
  const { title, description = '', status = 'todo' } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }

  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
  }

  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// ── PUT /tasks/:id ──────────────────────────────────────────────────────────
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, status } = req.body;
  const updated = { ...tasks[index] };

  if (title !== undefined) updated.title = title.trim();
  if (description !== undefined) updated.description = description.trim();
  if (status !== undefined) updated.status = status;

  tasks[index] = updated;
  res.json(updated);
});

// ── DELETE /tasks/:id ───────────────────────────────────────────────────────
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌼 TaskBloom backend running on http://localhost:${PORT}`);
});

