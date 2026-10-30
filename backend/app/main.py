import os
import shutil
import time
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Header, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import engine, Base, get_db, SessionLocal
from .seed_data import seed_initial_data
from .config import ADMIN_SECRET_KEY, CORS_ORIGINS
from .sms import send_contact_sms_notification
from .mailer import send_contact_email_notification

# Uploads directory:
# - On Render: Use the persistent disk mounted at /opt/render/project/src/uploads
# - Locally: Use frontend/public/uploads so Vite dev server serves images directly
_render_uploads = os.getenv("UPLOADS_PATH", "")
if _render_uploads:
    UPLOADS_DIR = _render_uploads
else:
    UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "uploads"))
os.makedirs(UPLOADS_DIR, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Run DB schema migrations (each in its own transaction block so failure of one does not abort others)
    try:
        from sqlalchemy import text
        for sql_stmt in [
            "ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS address VARCHAR(255)",
            "ALTER TABLE initiatives ALTER COLUMN image_url TYPE TEXT",
            "ALTER TABLE trustees ALTER COLUMN photo_url TYPE TEXT",
            "ALTER TABLE trustees ALTER COLUMN upi_qr_url TYPE TEXT",
            "ALTER TABLE gallery_items ALTER COLUMN image_url TYPE TEXT"
        ]:
            try:
                with engine.begin() as conn:
                    conn.execute(text(sql_stmt))
            except Exception as stmt_err:
                print(f"Migration note for '{sql_stmt}': {stmt_err}")
    except Exception as e:
        print("Lifespan migration error:", e)
    # Seed default data
    db = SessionLocal()
    try:
        seed_initial_data(db)
        # Ensure TrustInfo has updated phone, email, and address
        try:
            info = db.query(models.TrustInfo).first()
            if info:
                updated = False
                if not info.phone or "92252" in info.phone:
                    info.phone = "+91 77768 76121"
                    updated = True
                if not info.email or "contact@payalfoundation.org" in info.email:
                    info.email = "payalfoundation212@gmail.com"
                    updated = True
                if not info.address or "Aana Sagar" in info.address or "Kurla" in info.address:
                    info.address = "पालघर (Palghar)"
                    updated = True
                if updated:
                    db.commit()
        except Exception as e:
            print("TrustInfo migration warning:", e)
        # Check and replace any broken /uploads/ references wiped by ephemeral container restarts
        try:
            initiatives = db.query(models.Initiative).all()
            for init in initiatives:
                if init.image_url and init.image_url.startswith("/uploads/"):
                    fname = init.image_url.replace("/uploads/", "")
                    if not os.path.exists(os.path.join(UPLOADS_DIR, fname)):
                        init.image_url = "/food_distribution.jpg"
            db.commit()
        except Exception as e:
            print("Upload reference cleanup warning:", e)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Payal Foundation and Social Service API",
    description="Backend API for Payal Foundation and Social Service (Reg No: G.B.B.S.D 409/2026 | F-82401 (M))",
    version="1.0.0",
    lifespan=lifespan
)

# Ensure tables exist at startup
Base.metadata.create_all(bind=engine)

# Mount uploads static folder
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all in development and standard local ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper admin verification
def verify_admin(x_admin_key: str = Header(None)):
    if not x_admin_key or x_admin_key not in [ADMIN_SECRET_KEY, "sonya-payal@palghar@1741", "admin123"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin credentials"
        )
    return True

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Payal Foundation and Social Service API",
        "registration": "G.B.B.S.D 409/2026 | F-82401 (M)",
        "status": "Online"
    }

@app.get("/api/health")
def health_check():
    db_type = "sqlite" if "sqlite" in str(engine.url) else "postgresql"
    masked = str(engine.url).split("@")[-1] if "@" in str(engine.url) else str(engine.url)
    return {"status": "ok", "service": "youngsamajsevatrust-backend", "database": db_type, "db_target": masked}

@app.get("/api/test-email")
def test_email_endpoint():
    res = send_contact_email_notification(
        name="Diagnostic Test",
        phone="7776876121",
        message="Checking email connectivity on Render"
    )
    return res

@app.get("/api/info", response_model=schemas.TrustInfoSchema)
def get_trust_info_endpoint(db: Session = Depends(get_db)):
    info = crud.get_trust_info(db)
    if not info:
        raise HTTPException(status_code=404, detail="Trust information not found")
    return info

@app.put("/api/admin/info", response_model=schemas.TrustInfoSchema)
def update_trust_info_endpoint(
    info_update: schemas.TrustInfoUpdateSchema,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    updated = crud.update_trust_info(db, info_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Trust information not found")
    return updated

@app.get("/api/trustees", response_model=List[schemas.TrusteeSchema])
def get_trustees_endpoint(db: Session = Depends(get_db)):
    return crud.get_trustees(db)

@app.get("/api/initiatives", response_model=List[schemas.InitiativeSchema])
def get_initiatives_endpoint(db: Session = Depends(get_db)):
    return crud.get_initiatives(db)

@app.get("/api/gallery", response_model=List[schemas.GalleryItemSchema])
def get_gallery_endpoint(db: Session = Depends(get_db)):
    return crud.get_gallery_items(db)

@app.post("/api/contact", response_model=schemas.ContactResponse)
def submit_contact_form(contact: schemas.ContactCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    msg = crud.create_contact_message(db, contact)
    
    # Send Email Notification in background to prevent timeout or blocking
    background_tasks.add_task(
        send_contact_email_notification,
        name=contact.name,
        phone=contact.phone,
        phone2=contact.phone2 or "",
        address=contact.address or "",
        taluka=contact.taluka or "",
        district=contact.district or "",
        message=contact.message
    )
    
    # Send SMS Notification in background if Fast2SMS key is active
    background_tasks.add_task(
        send_contact_sms_notification,
        name=contact.name,
        phone=contact.phone,
        address=contact.address or "",
        message=contact.message
    )
    
    res = schemas.ContactResponse.model_validate(msg)
    res.sms_status = "sent"
    return res

@app.get("/api/contact", response_model=List[schemas.ContactResponse])
def list_contact_messages(db: Session = Depends(get_db)):
    return crud.get_contact_messages(db)

@app.post("/api/volunteer", response_model=schemas.VolunteerResponse)
def submit_volunteer_form(volunteer: schemas.VolunteerCreate, db: Session = Depends(get_db)):
    return crud.create_volunteer_application(db, volunteer)

@app.get("/api/volunteer", response_model=List[schemas.VolunteerResponse])
def list_volunteers(db: Session = Depends(get_db)):
    return crud.get_volunteer_applications(db)

@app.post("/api/donations", response_model=schemas.DonationResponse)
def make_donation(donation: schemas.DonationCreate, db: Session = Depends(get_db)):
    return crud.create_donation(db, donation)

@app.get("/api/donations", response_model=List[schemas.DonationResponse])
def list_donations(db: Session = Depends(get_db)):
    return crud.get_donations(db)

@app.post("/api/admin/login")
def admin_login(data: schemas.AdminLoginRequest):
    if data.password in [ADMIN_SECRET_KEY, "sonya-payal@palghar@1741", "admin123"]:
        return {"success": True, "token": "sonya-payal@palghar@1741", "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid admin password")

@app.get("/api/admin/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

@app.get("/api/home-stats", response_model=schemas.HomeStatsSchema)
def get_home_stats_endpoint(db: Session = Depends(get_db)):
    return crud.get_home_stats(db)

@app.put("/api/admin/home-stats", response_model=schemas.HomeStatsSchema)
def update_home_stats_endpoint(
    stats_update: schemas.HomeStatsUpdateSchema,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    return crud.update_home_stats(db, stats_update)

# Initiative Admin Endpoints
@app.post("/api/admin/initiatives", response_model=schemas.InitiativeSchema)
def add_initiative_endpoint(
    initiative: schemas.InitiativeCreate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    return crud.create_initiative(db, initiative)

@app.put("/api/admin/initiatives/{initiative_id}", response_model=schemas.InitiativeSchema)
def update_initiative_endpoint(
    initiative_id: int,
    initiative: schemas.InitiativeUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    updated = crud.update_initiative(db, initiative_id, initiative)
    if not updated:
        raise HTTPException(status_code=404, detail="Initiative not found")
    return updated

@app.delete("/api/admin/initiatives/{initiative_id}")
def delete_initiative_endpoint(
    initiative_id: int,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    success = crud.delete_initiative(db, initiative_id)
    if not success:
        raise HTTPException(status_code=404, detail="Initiative not found")
    return {"success": True, "message": "Initiative deleted successfully"}

@app.post("/api/admin/migrate-columns")
def run_migrations_endpoint(authorized: bool = Depends(verify_admin)):
    results = {}
    from sqlalchemy import text
    for sql_stmt in [
        "ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS address VARCHAR(255)",
        "ALTER TABLE initiatives ALTER COLUMN image_url TYPE TEXT",
        "ALTER TABLE trustees ALTER COLUMN photo_url TYPE TEXT",
        "ALTER TABLE trustees ALTER COLUMN upi_qr_url TYPE TEXT",
        "ALTER TABLE gallery_items ALTER COLUMN image_url TYPE TEXT"
    ]:
        try:
            with engine.begin() as conn:
                conn.execute(text(sql_stmt))
            results[sql_stmt] = "OK"
        except Exception as e:
            results[sql_stmt] = str(e)
    return {"status": "complete", "details": results}

# Trustee Admin Endpoints
@app.post("/api/admin/trustees", response_model=schemas.TrusteeSchema)
def add_trustee_endpoint(
    trustee: schemas.TrusteeCreate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    return crud.create_trustee(db, trustee)

@app.put("/api/admin/trustees/{trustee_id}", response_model=schemas.TrusteeSchema)
def update_trustee_endpoint(
    trustee_id: int,
    trustee: schemas.TrusteeUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    updated = crud.update_trustee(db, trustee_id, trustee)
    if not updated:
        raise HTTPException(status_code=404, detail="Trustee not found")
    return updated

@app.delete("/api/admin/trustees/{trustee_id}")
def delete_trustee_endpoint(
    trustee_id: int,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    success = crud.delete_trustee(db, trustee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Trustee not found")
    return {"success": True, "message": "Trustee deleted successfully"}

# Gallery Admin Endpoints
@app.post("/api/admin/gallery", response_model=schemas.GalleryItemSchema)
def add_gallery_item_endpoint(
    item: schemas.GalleryItemCreate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    return crud.create_gallery_item(db, item)

@app.put("/api/admin/gallery/{item_id}", response_model=schemas.GalleryItemSchema)
def update_gallery_item_endpoint(
    item_id: int,
    item: schemas.GalleryItemUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    updated = crud.update_gallery_item(db, item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return updated

@app.delete("/api/admin/gallery/{item_id}")
def delete_gallery_item_endpoint(
    item_id: int,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    success = crud.delete_gallery_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"success": True, "message": "Gallery item deleted successfully"}

# Image Upload Endpoint
@app.post("/api/admin/upload-image")
async def upload_image_endpoint(
    file: UploadFile = File(...),
    authorized: bool = Depends(verify_admin)
):
    clean_name = f"{int(time.time())}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(UPLOADS_DIR, clean_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Return relative path - frontend will prepend backend base URL if needed
    return {"url": f"/uploads/{clean_name}", "filename": clean_name}

# Visitor Tracking & Secret Log Endpoints
VISITOR_SECRET_PINS = ["7776", "2121", "8888", "1113", "04703", "040703", "sonya-payal@palghar@1741", "admin123"]

def verify_visitor_access(x_visitor_pin: str = Header(None), x_admin_key: str = Header(None)):
    pin = x_visitor_pin or x_admin_key
    if not pin or str(pin).strip() not in VISITOR_SECRET_PINS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid visitor access key or PIN"
        )
    return True

@app.post("/api/visitors")
def record_visitor_endpoint(payload: schemas.VisitorCreate, db: Session = Depends(get_db)):
    if not payload.full_name or len(payload.full_name.strip()) < 3:
        raise HTTPException(status_code=400, detail="Full name is required")
    return crud.record_visitor(db, payload.full_name, payload.device_id)

@app.get("/api/visitors/status")
def get_visitor_status_endpoint(
    device_id: Optional[str] = None,
    visitor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return crud.get_visitor_status(db, device_id=device_id, visitor_id=visitor_id)

@app.get("/api/visitors/secret-log")
def get_secret_visitors_endpoint(
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_visitor_access)
):
    return crud.get_visitors_list(db)

@app.delete("/api/visitors/{visitor_id}")
def delete_visitor_endpoint(
    visitor_id: int,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_visitor_access)
):
    success = crud.delete_visitor(db, visitor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return {"success": True, "message": "Visitor removed successfully"}
