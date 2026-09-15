# RouteExplorer

A Progressive Web App for motorcycle riders to track their routes in real time via GPS, visualize all past rides on a map, and see a cumulative coverage layer showing which roads in their city they have ridden.

Live demo: https://d2qkty4qjnsns4.cloudfront.net

---

## Architecture

![Architecture diagram](docs/Images/Architecture.png)

### How it works

1. The browser visits the URL and CloudFront delivers the React PWA's static files (HTML, JS, CSS) from S3. The browser caches these files locally so subsequent visits load instantly without hitting S3 again.
2. All subsequent API calls and WebSocket connections go from the browser through CloudFront to API Gateway, which forwards them to ECS
3. ECS Fargate runs a Docker container with two things inside: Node/Express handling all REST API endpoints, and Socket.io running the WebSocket server that listens for live GPS points streaming in from the phone during a ride
4. RDS manages the database: PostgreSQL stores users, rides, and route points, with the PostGIS extension enabling geographic data types and spatial queries like computing route distances and road coverage
5. Terraform defines and provisions all the AWS infrastructure above as code, and GitHub Actions handles CI/CD by automatically testing and deploying on every push to main

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite|
| Map | Leaflet.js |
| Backend | Node.js + Express + TypeScript |
| WebSockets | Socket.io |
| Database | PostgreSQL 15 |
| Geospatial | PostGIS |
| Auth | JWT (access + refresh tokens) |
| Containerization | Docker + docker-compose |
| Cloud | AWS (ECS Fargate, RDS, S3, CloudFront, API Gateway) |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Migrations | node-pg-migrate |

---

## Project structure

```
RouteExplorer/
├── backend/
│   ├── src/
│   │   ├── routes/        # Express route handlers
│   │   ├── middleware/    # JWT auth middleware
│   │   ├── socket/        # Socket.io GPS event handlers
│   │   ├── utils/         # JWT token utilities
│   │   └── index.ts       # Express + Socket.io server entry point
│   ├── migrations/        # node-pg-migrate schema migrations
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components (MapView, RideHistory, RideTracker)
│   │   ├── hooks/         # Custom hooks (useRide, useCoverage)
│   │   ├── api/           # API call functions
│   │   ├── pages/         # Login, Register pages
│   │   └── types/         # Shared TypeScript interfaces
│   └── package.json
├── infra/                 # Terraform infrastructure
├── docs/                  # Architecture diagrams and system design
├── docker-compose.yaml
└── README.md
```

---

## Running locally

### Prerequisites
- Node.js 20.19+
- Docker Desktop
- Git

### 1. Clone the repo
```bash
git clone https://github.com/sahithnulu/RouteExplorer.git
cd RouteExplorer
```

### 2. Set up environment variables
Create a `.env` file at the root:
```
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="yourpassword"
POSTGRES_DB="routeexplorer"
DATABASE_URL="postgresql://postgres:yourpassword@postgres:5432/routeexplorer"
DATABASE_URL_LOCAL="postgresql://postgres:yourpassword@localhost:5432/routeexplorer"
JWT_SECRET="your-secret-key"
```

### 3. Start the database
```bash
docker-compose up -d postgres
```

### 4. Run database migrations
```bash
cd backend
npm install
npm run migrate
```

### 5. Enable PostGIS
```bash
docker exec -it postgresdb psql -U postgres -d routeexplorer
```
Then inside the psql shell:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

### 6. Start the backend
```bash
cd backend
npm run dev
```

### 7. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 8. Open the app
Go to `http://localhost:5173` in your browser.

## Todo

- [ ] Add an Application Load Balancer (ALB) with an SSL certificate in front of ECS to support WebSocket connections in production — currently GPS point saving only works in local development