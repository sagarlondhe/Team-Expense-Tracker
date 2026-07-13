# HamBOLDS Expense Tracker

A lightweight full-stack app for logging team expenses, managing categories, and viewing summary totals.

## What it does
- Add, edit, and delete expenses
- Filter expenses by category and date range
- Paginate expense records
- Create and list categories with optional monthly budgets
- View category-level spending totals and over-budget status
- Validate inputs on the server before persisting data

## Stack
- Backend: Node.js, Express, SQLite
- Frontend: React, Vite

## Project layout
- backend/: API, routes, controllers, repositories, validators, and schema
- frontend/: React app

## Run locally

### Backend
1. Go to the backend folder.
2. Run `npm install`.
3. Start the server with `npm start`.
4. API runs at `http://localhost:5000`.

### Frontend
1. Open a second terminal in the frontend folder.
2. Run `npm install`.
3. Start the app with `npm run dev`.
4. Open the Vite URL shown in the terminal.

## API routes
- Categories: `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
- Expenses: `GET /api/expenses`, `POST /api/expenses`, `PUT /api/expenses/:id`, `DELETE /api/expenses/:id`
- Summary: `GET /api/summary`

## Notes
- SQLite is used, so no separate database service is required.
- The database file is created automatically in `backend/database/expenses.db`.
- To run the backend on a different port, set `PORT` before launching it.

## Verification
- Backend repository tests were run.
- The summary endpoint was checked over HTTP.
- The frontend production build completed successfully.

## Deployment on Render
This project is prepared to deploy as exactly two Render services:
- Backend: Web Service
- Frontend: Static Site

### Backend deployment
1. Create a new Render Web Service for the backend.
2. Point it to the repository and set the root directory to `backend`.
3. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`
4. Add the following environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `FRONTEND_URL=https://your-frontend.onrender.com`
   - `DATABASE_URL=./database/expenses.db`

### Frontend deployment
1. Create a new Render Static Site for the frontend.
2. Point it to the repository and set the root directory to `frontend`.
3. Use these settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add the build environment variable:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Environment variables
- Backend example file: `backend/.env.example`
- Frontend example file: `frontend/.env.example`

### Connecting frontend to backend
The frontend reads its API base URL from `VITE_API_BASE_URL`, so no hardcoded API URL is needed. After deployment, update the frontend environment variable to the deployed backend URL and the frontend will communicate with it automatically.

### Troubleshooting
- If the frontend cannot reach the API, confirm that `VITE_API_BASE_URL` points to the backend service URL ending in `/api`.
- If CORS errors appear, verify that `FRONTEND_URL` in the backend matches the deployed frontend URL exactly.
- If the backend health check fails, open `https://your-backend.onrender.com/health` to confirm the service is up.
