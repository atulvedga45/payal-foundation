@echo off
echo ========================================================
echo   Starting Payal Foundation and Social Service Fullstack App
echo   Frontend: React (Vite)
echo   Backend: FastAPI (Python)
echo   Database: PostgreSQL / Auto-fallback
echo ========================================================

start "Samaj Seva Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"
timeout /t 2 >nul
start "Samaj Seva Frontend (React)" cmd /k "cd frontend && npm run dev"

echo.
echo Servers started!
echo Frontend: http://localhost:5173
echo Backend API & Swagger Docs: http://localhost:8000/docs
echo Admin Key: admin123
echo.
pause
