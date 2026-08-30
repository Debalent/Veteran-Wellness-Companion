# Plan: Start Development Servers

## Objective
Start both backend and frontend dev servers to view the UI in a local browser.

## Current State
- Frontend (Vite + React) runs on port **5173**
- Backend (Node.js + Express) runs on port **3001**
- Vite proxies `/api` requests to `http://localhost:3001`
- `node_modules` exist in both `backend/` and `frontend/`
- No `.env` files exist yet
- Backend requires PostgreSQL database at `localhost:5432`

## Steps

### 1. Verify PostgreSQL Availability
Check if PostgreSQL is running locally on port 5432. If not, start it or use Docker.

### 2. Create Environment Files
- Copy `config/.env.example` → `.env` (root-level)
- Optionally copy `backend/.env.example` → `backend/.env`
- Ensure `DATABASE_URL` points to a reachable PostgreSQL instance

### 3. Initialize Database (if needed)
Run `cd backend && npx prisma db push` to sync schema with database.

### 4. Start Backend Dev Server
Run `cd backend && npm run dev` (uses `tsx watch src/server.ts`).

### 5. Start Frontend Dev Server
Run `cd frontend && npm run dev` (uses `vite`).

### 6. Verify
- Backend health: `http://localhost:3001/health` (or similar)
- Frontend UI: `http://localhost:5173`

## Risks / Open Questions
- **Database**: Is PostgreSQL installed and running locally? If not, how should it be provisioned?
- **Port conflicts**: Are ports 3001 and 5173 available?
- **First-run migrations**: Does the database need seeding before the UI is usable?

## Validation
- Navigate to `http://localhost:5173` in browser
- Confirm React app loads without console errors
- Confirm API requests succeed (via Vite proxy to backend)
