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
