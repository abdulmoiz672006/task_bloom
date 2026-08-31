# TaskBloom 🌼 | DevOps Transformation & Observability

TaskBloom is a full-stack task management application where I engineered a complete production-grade infrastructure. I took a basic application and transformed it into a scalable, observable, and automated system.

---

## 🚀 The Challenge (The "Why")

The original application was a simple local project. To make it "Production-Ready," I solved several engineering challenges:

- **Environment Consistency:** Containerized the application to ensure it runs identically across local development and AWS EC2.
- **Manual Deployment:** Eliminated error-prone manual steps by implementing a fully automated GitHub Actions CI/CD pipeline.
- **Zero Visibility:** Integrated a full observability stack to monitor application health and performance in real-time.
- **Complex Routing:** Configured NGINX Ingress to manage traffic between the UI, API, and Monitoring tools under a single entry point.

---

## 🏗 My Strategic Solutions (The "How")

### 1. Orchestration & Scaling
- **Kubernetes (KIND):** Managed the application lifecycle using KIND (Kubernetes-in-Docker) on an AWS EC2 instance for high availability.
- **Helm Charts:** Developed modular Helm charts to make deployments reusable, version-controlled, and easily configurable.

### 2. Full-Stack Observability
- **Custom Metrics:** Integrated `prom-client` in the Node.js backend to track metrics like event loop lag, memory usage, and active connections.
- **Automated Scraping:** Configured Prometheus `ServiceMonitors` to automatically discover and scrape the backend service every 15 seconds.
- **Visual Insights:** Built a Grafana dashboard to visualize system-level metrics (CPU, RAM, Network) and application-level health at a glance.

### 3. Automated CI/CD Lifecycle
Every `git push` to the main branch triggers a multi-stage automated workflow:

- **CI:** Automated dependency health checks for both React and Node.js.
- **CD:** Automated Docker image builds, pushing to Docker Hub, and remote SSH deployment to EC2 via Helm.
- **Disaster Recovery:** The pipeline auto-restores the entire stack with a single push if infrastructure needs redeployment.

---

## 🏛 Architecture

```
                         ┌─────────────────────────────────────┐
                         │           AWS EC2 Instance           │
                         │                                      │
   Browser               │   ┌──────────────────────────────┐  │
     │                   │   │    NGINX Ingress Controller   │  │
     │  HTTP Request      │   │                              │  │
     └──────────────────►│   │  /          →  Frontend      │  │
                         │   │  /api/*     →  Backend       │  │
                         │   │  /grafana   →  Grafana       │  │
                         │   └──────┬───────────┬───────────┘  │
                         │          │           │              │
                         │    ┌─────┘     ┌─────┘              │
                         │    ▼           ▼           ▼        │
                         │ ┌────────┐ ┌────────┐ ┌────────┐   │
                         │ │ React  │ │Node.js │ │Grafana │   │
                         │ │Frontend│ │Backend │ │        │   │
                         │ │ :3000  │ │ :5000  │ │ :3000  │   │
                         │ └────────┘ └───┬────┘ └───┬────┘   │
                         │               │  /metrics │        │
                         │               ▼     queries│        │
                         │          ┌──────────┐      │        │
                         │          │Prometheus│◄─────┘        │
                         │          │scrapes   │               │
                         │          │every 15s │               │
                         │          └──────────┘               │
                         └─────────────────────────────────────┘
                                         ▲
                                         │  SSH Deploy
                         ┌───────────────┴──────────────┐
                         │        GitHub Actions         │
                         │  push → CI → Build → Deploy  │
                         └──────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline Flow

```
git push (main)
      │
      ├── backend-ci   ──► npm install (dependency check)
      ├── frontend-ci  ──► npm install (dependency check)
      │
      └── docker-build-push
                │
                ├── docker build backend  → push to Docker Hub
                ├── docker build frontend → push to Docker Hub
                │
                └── deploy (SSH → EC2)
                        ├── git pull (latest code)
                        ├── docker pull (latest images)
                        ├── helm upgrade --install
                        ├── Grafana root_url update (dynamic IP)
                        └── ServiceMonitor apply (Prometheus scraping)
```

> **After EC2 restart:** Update `EC2_HOST` in GitHub Secrets → `git push` — pipeline restores everything automatically.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend / Backend** | React, Node.js, Express |
| **Infrastructure** | Docker, Kubernetes (KIND), Helm |
| **Networking** | NGINX Ingress Controller |
| **Monitoring** | Prometheus, Grafana, prom-client |
| **Automation** | GitHub Actions, AWS EC2 |

---

## 🌐 Live Infrastructure

| Service | URL |
| :--- | :--- |
| Application UI | `http://<EC2_IP>/` |
| Backend Tasks | `http://<EC2_IP>/api/tasks` |
| Grafana Dashboard | `http://<EC2_IP>/grafana` |

---

## 🖥 Run This Project Locally

### Prerequisites

Make sure you have these installed:

- [Docker](https://docs.docker.com/get-docker/)
- [KIND](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/abdulmoiz672006/task_bloom.git
cd task_bloom
```

### Step 2 — Create KIND Cluster

```bash
kind create cluster --config kind-config.yaml
```

### Step 3 — Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for it to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

### Step 4 — Create Namespace & Deploy App

```bash
kubectl create namespace taskbloom

helm upgrade --install taskbloom ./helm/taskbloom -n taskbloom
```

### Step 5 — Install Monitoring Stack

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace
```

### Step 6 — Access the Application

```
Frontend  →  http://localhost/
API       →  http://localhost/api/tasks
Grafana   →  http://localhost/grafana
```

> **Grafana login:** Username `admin` — get password with:
> ```bash
> kubectl get secret monitoring-grafana -n monitoring \
>   -o jsonpath="{.data.admin-password}" | base64 --decode
> ```

### Step 7 — Add Prometheus Data Source in Grafana

1. Login → **Connections** → **Data Sources** → **Add**
2. Select **Prometheus**
3. URL: `http://prometheus-operated.monitoring.svc.cluster.local:9090`
4. Click **Save & Test**

### Step 8 — Import Dashboard

1. Grafana → **Dashboards** → **Import**
2. Enter ID: `1860`
3. Select Prometheus data source → **Import**

---

## 🔑 GitHub Secrets Required

| Secret | Description |
| :--- | :--- |
| `EC2_HOST` | Public IP of EC2 instance |
| `EC2_SSH_KEY` | Private key for SSH access (full PEM content) |
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/metrics` | Prometheus metrics |
| GET | `/health` | Health check |

---

## 📸 Screenshots

### Live Application
![TaskBloom UI](screenshots/app-ui.png)

### Monitoring Dashboard (Grafana + Prometheus)
![Grafana Dashboard](screenshots/grafana-dashboard.png)

### CI/CD Pipeline (GitHub Actions)
![CI/CD Pipeline](screenshots/cicd-pipeline.png)

### Kubernetes Cluster Status
![Cluster Pods](screenshots/kubectl-pods.png)

### NGINX Ingress Routing
![Ingress Config](screenshots/ingress-config.png)

### Helm Deployment
![Helm Deploy](screenshots/helm-deploy.png)

---

## ⚠️ Project Status

This project was built purely for learning and practice purposes. The AWS EC2 instance and cloud resources have since been deleted to avoid ongoing costs, so the live links (app, API, Grafana) are no longer active. GitHub Actions CI/CD has also been disabled since there is no live server to deploy to. All code, configuration, and documentation remain intact to demonstrate the DevOps workflow that was implemented.

---

## 📜 Credits & Attribution

This project focuses on the DevOps transformation of an existing codebase.

- **Base Application:** [yo-its-anas/task_bloom](https://github.com/yo-its-anas/task_bloom)
- **DevOps Engineering:** [Abdul Moiz](https://github.com/abdulmoiz672006) — Docker, Kubernetes, Helm, Monitoring, CI/CD

**Author:** Abdul Moiz
**GitHub:** [github.com/abdulmoiz672006](https://github.com/abdulmoiz672006)
