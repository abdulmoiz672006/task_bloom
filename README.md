# TaskBloom 🌼 | DevOps Transformation & Observability

TaskBloom is a full-stack task management application where I engineered a complete production-grade infrastructure. I took a basic application and transformed it into a scalable, observable, and automated system.

---

## 🚀 The Challenge (The "Why")
The original application was a simple local project. To make it "Production-Ready," I solved several engineering challenges:
* **Environment Consistency:** Containerized the application to ensure it runs identically across local development and AWS EC2.
* **Manual Deployment:** Eliminated error-prone manual steps by implementing a fully automated GitHub Actions CI/CD pipeline.
* **Zero Visibility:** Integrated a full observability stack to monitor application health and performance in real-time.
* **Complex Routing:** Configured NGINX Ingress to manage traffic between the UI, API, and Monitoring tools under a single entry point.

---

## 🏗 My Strategic Solutions (The "How")

### 1. Orchestration & Scaling
* **Kubernetes (KIND):** Managed the application lifecycle using KIND (Kubernetes-in-Docker) on an AWS EC2 instance for high availability.
* **Helm Charts:** Developed modular Helm charts to make deployments reusable, version-controlled, and easily configurable.

### 2. Full-Stack Observability
* **Custom Metrics:** Integrated `prom-client` in the Node.js backend to track metrics like event loop lag, memory usage, and active connections.
* **Automated Scraping:** Configured Prometheus `ServiceMonitors` to automatically discover and scrape the backend service every 15 seconds.
* **Visual Insights:** Built a Grafana dashboard to visualize system-level metrics (CPU, RAM, Network) and application-level health at a glance.

### 3. Automated CI/CD Lifecycle
Every `git push` to the main branch triggers a multi-stage automated workflow:
* **CI:** Automated dependency health and security checks for both React and Node.js.
* **CD:** Automated Docker image builds, pushing to Docker Hub, and remote SSH deployment to EC2 via Helm.
* **Disaster Recovery:** The pipeline is designed to auto-restore the entire stack with a single push if the infrastructure needs to be redeployed.

---

## 🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend/Backend** | React, Node.js, Express |
| **Infrastructure** | Docker, Kubernetes (KIND), Helm |
| **Networking** | NGINX Ingress Controller |
| **Monitoring** | Prometheus, Grafana, prom-client |
| **Automation** | GitHub Actions, AWS EC2 |

---

## 🌐 Live Infrastructure
* **Application UI:** `http://<EC2_IP>/`
* **API Metrics:** `http://<EC2_IP>/api/metrics`
* **Monitoring:** `http://<EC2_IP>/grafana`

---

## 📜 Credits & Attribution
This project focuses on the DevOps transformation of an existing codebase.
* **Base Application:** [yo-its-anas/task_bloom](https://github.com/yo-its-anas/task_bloom)
* **DevOps Engineering:** [Abdul Moiz](https://github.com/abdulmoiz672006/task_bloom) (Docker, K8s, Helm, Monitoring, CI/CD)

**Author:** Abdul Moiz  
**GitHub:** [github.com/abdulmoiz672006](https://github.com/abdulmoiz672006)
