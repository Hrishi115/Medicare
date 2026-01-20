# MediCare — Hospital Management System

MediCare is a lightweight hospital/clinic management web application that provides a simple UI and API for managing patients, doctors, appointments, medical records, pharmacy inventory (medicines), and billing. The project contains a React frontend and a Python asynchronous backend (FastAPI) that uses MongoDB for data storage.

## Features
- Patient management: create, read, update, delete patients
- Doctor management: create and manage doctor profiles
- Appointments: schedule and list appointments
- Medical records: add and view patient medical records (diagnoses, prescriptions, tests, notes)
- Inventory (Pharmacy): add/update/delete medicines with quantity, expiry date, manufacturer and category
- Billing: create bills, list bills and update payment status

## Tech stack
- Frontend: React (Create React App), Tailwind CSS + UI components (shadcn/ui patterns), lucide-react icons, sonner for toasts
- Backend: Python (FastAPI), Pydantic models, async MongoDB driver (Motor or similar)
- Database: MongoDB

## Repository structure
- frontend/ — React application (UI components in `src/components`)
- backend/ — FastAPI backend (`server.py` contains models and API routes)
- tests/ — test files and `test_result.md` (test run output)

## Quickstart (Development)
Requirements: Node.js (for frontend), Python 3.10+ (or 3.9+), MongoDB

1. Start MongoDB
   - Local: `mongod --config /usr/local/etc/mongod.conf` or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:6`

2. Run the backend
   - Create a virtualenv and install dependencies:
     ```bash
     python -m venv .venv
     source .venv/bin/activate  # Windows: .venv\Scripts\activate
     pip install -r backend/requirements.txt  # if present; otherwise install fastapi, uvicorn, motor, pydantic
     ```
   - Set environment variables (example):
     ```bash
     export MONGO_URI="mongodb://localhost:27017/medicare"
     ```
   - Start the FastAPI server:
     ```bash
     uvicorn backend.server:app --reload --port 8000
     ```
   - The API root will be available at: `http://localhost:8000/api/` (or `http://localhost:8000/` depending on routing)

3. Run the frontend
   - Install and start the React app:
     ```bash
     cd frontend
     npm install
     REACT_APP_BACKEND_URL=http://localhost:8000  # or set in .env
     npm start
     ```
   - Open `http://localhost:3000` to view the UI.

## Environment variables
- MONGO_URI — connection string for MongoDB (e.g. `mongodb://localhost:27017/medicare`)
- REACT_APP_BACKEND_URL — full backend URL used by the frontend (e.g. `http://localhost:8000`)

## API overview (selected endpoints)
- GET /api/patients — list patients
- POST /api/patients — create patient
- GET /api/doctors — list doctors
- POST /api/appointments — create appointment
- GET /api/medical-records — list medical records
- POST /api/medical-records — add medical record
- GET /api/medicines — list medicines
- POST /api/medicines — add medicine
- PUT /api/medicines/{id} — update medicine
- DELETE /api/medicines/{id} — delete medicine
- POST /api/bills — create bill
- PATCH /api/bills/{id}/status — update bill payment status

(See `backend/server.py` for full model and route definitions.)

## Tests
- There is a `tests/` directory and a `test_result.md` file with test output. Run any tests present using the framework used in the tests (check `tests/` for instructions).

## Contributing
- Feel free to open issues or pull requests. Suggested improvements: authentication/authorization, validation, improved error handling, pagination for list endpoints, better seeding scripts and CI/CD, Docker setup, and deployment instructions.

## Notes and next steps
- The backend exposes Pydantic models and async routes in `backend/server.py` and expects a MongoDB instance.
- The frontend expects `REACT_APP_BACKEND_URL` to be set to the backend base URL.
- If you want, I can add a Docker Compose setup, example .env files, or a small seed script to populate sample data.

---

