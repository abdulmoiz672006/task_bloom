# TaskBloom 🌼

A full-stack task management web application built with **Node.js + Express** on the backend and **React** on the frontend. Tasks are organized in a kanban-style dashboard across three status columns — all backed by a lightweight in-memory store, so there's zero database setup required.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, plain CSS               |
| Backend   | Node.js, Express 4                |
| Database  | In-memory array (no external DB)  |
| API style | RESTful JSON                      |

---

## Project Structure

```
task_bloom/
├── backend/
│   ├── server.js          # Express server — routes, middleware, in-memory store
│   └── package.json       # Backend dependencies (express, cors, uuid)
│
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML shell
│   └── src/
│       ├── index.js       # React entry point
│       ├── App.js         # Root component — state management & CRUD logic
│       ├── App.css        # Pastel design system (tokens, layout, animations)
│       └── components/
│           ├── TaskCard.js    # Individual task card with inline status selector
│           ├── TaskColumn.js  # Kanban column (Todo / In Progress / Done)
│           └── TaskModal.js   # Create & edit modal with form validation
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-bloom.git
cd task-bloom
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The API server starts on **http://localhost:5000**

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The React dev server starts on **http://localhost:3000** and opens automatically in your browser.

> Both services must be running at the same time. The frontend calls the backend at `http://localhost:5000` by default.

---

## Ports at a Glance

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:3000    |
| Backend  | http://localhost:5000    |
| Health   | http://localhost:5000/health |

---

## API Reference

Base URL: `http://localhost:5000`

### Health check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "uptime": 42.3,
  "timestamp": "2026-04-11T10:00:00.000Z"
}
```

---

### List tasks

```
GET /tasks
```

Optional query parameter to filter by status:

```
GET /tasks?status=todo
GET /tasks?status=in-progress
GET /tasks?status=done
```

Response — array of task objects:
```json
[
  {
    "id": "a1b2c3d4-...",
    "title": "Design the dashboard",
    "description": "Create wireframes for the kanban board",
    "status": "in-progress",
    "createdAt": "2026-04-11T09:00:00.000Z"
  }
]
```

---

### Create a task

```
POST /tasks
Content-Type: application/json
```

Request body:
```json
{
  "title": "Write unit tests",
  "description": "Cover all API endpoints",
  "status": "todo"
}
```

- `title` — required
- `description` — optional, defaults to `""`
- `status` — optional, defaults to `"todo"`. Accepted values: `todo`, `in-progress`, `done`

Response `201 Created`:
```json
{
  "id": "e5f6g7h8-...",
  "title": "Write unit tests",
  "description": "Cover all API endpoints",
  "status": "todo",
  "createdAt": "2026-04-11T10:05:00.000Z"
}
```

---

### Update a task

```
PUT /tasks/:id
Content-Type: application/json
```

Send only the fields you want to change:
```json
{
  "status": "done"
}
```

Response `200 OK` — the updated task object.
Response `404 Not Found` if the id doesn't exist.

---

### Delete a task

```
DELETE /tasks/:id
```

Response `204 No Content` on success.
Response `404 Not Found` if the id doesn't exist.

---

## Task Object Schema

| Field         | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| `id`          | `string` | UUID v4, auto-generated                          |
| `title`       | `string` | Short summary of the task                        |
| `description` | `string` | Optional longer detail                           |
| `status`      | `string` | `todo` \| `in-progress` \| `done`               |
| `createdAt`   | `string` | ISO 8601 timestamp, set at creation              |

---

## Features

- **Kanban board** — three columns (To Do, In Progress, Done) with live task counts
- **Stats dashboard** — card strip showing totals per status at a glance
- **Filter bar** — one-click filtering to focus on a single status
- **Create & edit modal** — keyboard-friendly form (Escape to close, backdrop click to dismiss)
- **Inline status change** — update a task's status directly from its card without opening the modal
- **Optimistic UI** — state updates immediately in the browser; no full page reloads
- **Error handling** — connection error banner with a retry button if the backend is unreachable
- **Loading state** — animated spinner while the initial fetch is in progress
- **Responsive layout** — three-column grid collapses to a single column on mobile
- **Pastel design system** — lavender, pink, and mint palette; rounded cards; smooth hover animations

---

## Environment Variables

### Frontend

The API base URL can be overridden by creating a `.env` file inside `/frontend`:

```
REACT_APP_API_URL=http://localhost:5000
```

This is useful if you deploy the backend to a different host or port.

---

## Project Scripts

### Backend (`/backend`)

| Command       | Description                        |
|---------------|------------------------------------|
| `npm start`   | Start the server with `node`       |
| `npm run dev` | Start with `nodemon` (auto-reload) |

### Frontend (`/frontend`)

| Command       | Description                              |
|---------------|------------------------------------------|
| `npm start`   | Start the React development server       |
| `npm run build` | Create an optimised production build   |
| `npm test`    | Run the test suite                       |

---

## Notes

- **In-memory store** — all task data lives in a JavaScript array inside the running Node process. Restarting the backend resets the data. This is intentional for simplicity; swap in a real database (MongoDB, PostgreSQL, SQLite) by replacing the array operations in `server.js`.
- **CORS** — the backend enables CORS for all origins via the `cors` package, so the React dev server on port 3000 can call the API on port 5000 without browser errors.
- **No authentication** — this project has no login or access control. All tasks are shared in the same in-memory store.

---

## License

MIT
# CI/CD Test
