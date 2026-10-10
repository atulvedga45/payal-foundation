import os
import shutil
import time
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Header, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import engine, Base, get_db, SessionLocal
from .seed_data import seed_initial_data
from .config import ADMIN_SECRET_KEY, CORS_ORIGINS

UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "uploads"))
os.makedirs(UPLOADS_DIR, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Seed default data
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Payal Foundation and Social Service API",
    description="Backend API for Payal Foundation and Social Service (Reg No: G.B.B.S.D 409/2026 | F-82401 (M))",
    version="1.0.0",
    lifespan=lifespan
)

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
    if not x_admin_key or x_admin_key != ADMIN_SECRET_KEY:
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
    return {"status": "ok", "service": "youngsamajsevatrust-backend"}

@app.get("/api/info", response_model=schemas.TrustInfoSchema)
def get_trust_info_endpoint(db: Session = Depends(get_db)):
    info = crud.get_trust_info(db)
    if not info:
        raise HTTPException(status_code=404, detail="Trust information not found")
    return info

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
def submit_contact_form(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    return crud.create_contact_message(db, contact)

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
    if data.password == ADMIN_SECRET_KEY:
        return {"success": True, "token": ADMIN_SECRET_KEY, "role": "admin"}
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
    return {"url": f"/uploads/{clean_name}", "filename": clean_name}
