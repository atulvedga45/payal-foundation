from sqlalchemy.orm import Session
from . import models, schemas

def get_trust_info(db: Session):
    return db.query(models.TrustInfo).first()

def get_trustees(db: Session):
    return db.query(models.Trustee).order_by(models.Trustee.order.asc(), models.Trustee.id.asc()).all()

def get_initiatives(db: Session):
    return db.query(models.Initiative).all()

def create_contact_message(db: Session, contact: schemas.ContactCreate):
    db_obj = models.ContactMessage(
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        message=contact.message
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_contact_messages(db: Session):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()

def create_volunteer_application(db: Session, volunteer: schemas.VolunteerCreate):
    db_obj = models.VolunteerApplication(
        full_name=volunteer.full_name,
        phone=volunteer.phone,
        email=volunteer.email,
        city=volunteer.city,
        interest_area=volunteer.interest_area,
        skills=volunteer.skills,
        message=volunteer.message
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_volunteer_applications(db: Session):
    return db.query(models.VolunteerApplication).order_by(models.VolunteerApplication.created_at.desc()).all()

def create_donation(db: Session, donation: schemas.DonationCreate):
    db_obj = models.Donation(
        donor_name=donation.donor_name,
        donor_phone=donation.donor_phone,
        donor_email=donation.donor_email,
        donor_pan=donation.donor_pan,
        amount=donation.amount,
        payment_method=donation.payment_method,
        transaction_ref=donation.transaction_ref,
        cause=donation.cause or "General Community Fund",
        is_verified=True
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_donations(db: Session):
    return db.query(models.Donation).order_by(models.Donation.created_at.desc()).all()

def get_dashboard_stats(db: Session):
    total_donations = db.query(models.Donation).count()
    total_amount = sum(d.amount for d in db.query(models.Donation).all()) or 0.0
    total_volunteers = db.query(models.VolunteerApplication).count()
    total_messages = db.query(models.ContactMessage).count()
    return {
        "total_donations_count": total_donations,
        "total_donations_amount": total_amount,
        "total_volunteers_count": total_volunteers,
        "total_messages_count": total_messages
    }
