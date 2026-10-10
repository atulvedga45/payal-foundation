from sqlalchemy.orm import Session
from . import models, schemas

def get_trust_info(db: Session):
    return db.query(models.TrustInfo).first()

def get_trustees(db: Session):
    return db.query(models.Trustee).order_by(models.Trustee.order.asc(), models.Trustee.id.asc()).all()

def create_trustee(db: Session, trustee: schemas.TrusteeCreate):
    db_obj = models.Trustee(
        name=trustee.name,
        role=trustee.role,
        role_mr=trustee.role_mr,
        photo_url=trustee.photo_url,
        phone=trustee.phone or "1234567890",
        upi_id=trustee.upi_id or "payalfoundation@ybl",
        upi_qr_url=trustee.upi_qr_url,
        order=trustee.order or 0
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_trustee(db: Session, trustee_id: int, trustee_data: schemas.TrusteeUpdate):
    db_obj = db.query(models.Trustee).filter(models.Trustee.id == trustee_id).first()
    if not db_obj:
        return None
    data = trustee_data.model_dump(exclude_unset=True) if hasattr(trustee_data, "model_dump") else trustee_data.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(db_obj, field, val)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_trustee(db: Session, trustee_id: int):
    db_obj = db.query(models.Trustee).filter(models.Trustee.id == trustee_id).first()
    if not db_obj:
        return False
    db.delete(db_obj)
    db.commit()
    return True

def get_initiatives(db: Session):
    return db.query(models.Initiative).order_by(models.Initiative.id.asc()).all()

def create_initiative(db: Session, init: schemas.InitiativeCreate):
    db_obj = models.Initiative(
        title=init.title,
        title_mr=init.title_mr,
        description=init.description,
        description_mr=init.description_mr,
        category=init.category,
        icon=init.icon or "Heart",
        image_url=init.image_url,
        target_amount=init.target_amount,
        raised_amount=init.raised_amount
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_initiative(db: Session, initiative_id: int, init_data: schemas.InitiativeUpdate):
    db_obj = db.query(models.Initiative).filter(models.Initiative.id == initiative_id).first()
    if not db_obj:
        return None
    data = init_data.model_dump(exclude_unset=True) if hasattr(init_data, "model_dump") else init_data.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(db_obj, field, val)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_initiative(db: Session, initiative_id: int):
    db_obj = db.query(models.Initiative).filter(models.Initiative.id == initiative_id).first()
    if not db_obj:
        return False
    db.delete(db_obj)
    db.commit()
    return True

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

def get_home_stats(db: Session):
    stats = db.query(models.HomeStat).first()
    if not stats:
        stats = models.HomeStat(
            stat1_number="100%",
            stat1_label="Community Dedicated",
            stat1_label_mr="समाजास समर्पित",
            stat2_number="50+",
            stat2_label="Active Social Workers",
            stat2_label_mr="सक्रिय समाजसेवक",
            stat3_number="10,000+",
            stat3_label="Families Impacted",
            stat3_label_mr="मदत पोहचलेली कुटुंबे"
        )
        db.add(stats)
        db.commit()
        db.refresh(stats)
    return stats

def update_home_stats(db: Session, update_data: schemas.HomeStatsUpdateSchema):
    stats = get_home_stats(db)
    # Support pydantic v1 or v2 (dict or model_dump)
    data = update_data.model_dump(exclude_unset=True) if hasattr(update_data, "model_dump") else update_data.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(stats, field, val)
    db.commit()
    db.refresh(stats)
    return stats

def get_gallery_items(db: Session):
    return db.query(models.GalleryItem).order_by(models.GalleryItem.order.asc(), models.GalleryItem.id.asc()).all()

def create_gallery_item(db: Session, item: schemas.GalleryItemCreate):
    title_val = item.title or item.title_mr or "Gallery Photo"
    title_mr_val = item.title_mr or item.title or "सामाजिक छायाचित्र"
    category_val = item.category or "Social Service"
    category_mr_val = item.category_mr or "सामाजिक कार्य"
    db_obj = models.GalleryItem(
        image_url=item.image_url,
        title=title_val,
        title_mr=title_mr_val,
        category=category_val,
        category_mr=category_mr_val,
        order=item.order or 0
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_gallery_item(db: Session, item_id: int, item_data: schemas.GalleryItemUpdate):
    db_obj = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if not db_obj:
        return None
    data = item_data.model_dump(exclude_unset=True) if hasattr(item_data, "model_dump") else item_data.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(db_obj, field, val)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_gallery_item(db: Session, item_id: int):
    db_obj = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if not db_obj:
        return False
    db.delete(db_obj)
    db.commit()
    return True
