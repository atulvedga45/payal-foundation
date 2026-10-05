# Payal Foundation and Social Service — Fullstack Web Application
**नोंदणीकृत सामाजिक संस्था (Reg No: G.B.B.S.D 409/2026 | F-82401 (M))**

A modern, production-ready fullstack website for **Payal Foundation and Social Service**.

---

## 🌟 Tech Stack
- **Frontend**: React (Vite), Modern Vanilla CSS Design System, Lucide Icons, Canvas Confetti
- **Backend**: FastAPI (Python), Uvicorn, Pydantic, SQLAlchemy ORM
- **Database**: PostgreSQL (with automated graceful SQLite fallback for instant zero-config testing)
- **Deployment**: Docker & Docker Compose ready, Nginx configuration included

---

## 🚀 Key Features

1. **Dual Language Support (मराठी & English)**:
   - Instant language switch between Marathi (मराठी) and English for Maharashtra citizens and worldwide donors.

2. **Official Trust Details & Governance**:
   - Authorized Public Trust Act credentials (Reg No: `G.B.B.S.D 409/2026 | F-82401 (M)`).
   - Leadership profiles: President **Zakir Hussain**, Secretary **Mohd Rahim Abdul Kalam Khan**, and all trustees (**Masum Raja**, **Mugahed**, **Rajabul**, **Safikul**, **Taseen**, **Golam Mainuddin**).

3. **Active Initiatives & Live Progress**:
   - Youth Empowerment & Skill Development
   - Community Food & Ration Distribution
   - Free Medical Checkups & Health Camps
   - Women Support & Emergency Relief

4. **Real Donation Portal**:
   - Dynamic UPI QR Code generator (pre-fills selected donation amounts).
   - Direct Bank Transfer details (SBI Sakinaka Branch, Account number & IFSC copy buttons).
   - Instant computer-generated **Official 80G Donation Receipt** with printable/PDF format and celebration animation.

5. **Volunteer Application Form**:
   - Citizens and youth can apply directly as volunteers with interest area selection.

6. **Interactive Contact & Office Desk**:
   - Official office address in Sakinaka, Kurla-Andheri Road, Mumbai.
   - Click-to-call phone and direct email links.
   - Message inquiry submission stored in database.

7. **Admin Portal (`admin123`)**:
   - Secure management view to inspect live donations, volunteer applications, and inquiries.

---

## 🛠️ How to Run Locally

### Option 1: One-Click Runner (Windows)
Double click `start_servers.bat` in this folder. It will launch both the FastAPI backend and React frontend automatically!

### Option 2: Manual Terminal Commands

#### 1. Start Backend (FastAPI):
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs & Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Start Frontend (React):
```bash
cd frontend
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🐘 PostgreSQL Configuration
In `backend/.env`, set your PostgreSQL connection URL:
```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
```
*Note: If PostgreSQL is not configured or offline, the backend automatically falls back to local SQLite (`samajseva.db`) so the application never crashes.*

---

## 🐳 Docker Deployment
To launch the entire stack with PostgreSQL, Backend, and Frontend in containers:
```bash
docker compose up --build -d
```
