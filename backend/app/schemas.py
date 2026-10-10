from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Trust Info
class TrustInfoSchema(BaseModel):
    name: str
    tagline: str
    tagline_mr: Optional[str] = None
    reg_no: str
    act_name: str
    president: str
    secretary: str
    phone: str
    email: str
    address: str
    bank_name: str
    bank_account_no: str
    bank_ifsc: str
    upi_id: str

    class Config:
        from_attributes = True

# Trustee
class TrusteeSchema(BaseModel):
    id: int
    name: str
    role: str
    role_mr: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = "1234567890"
    upi_id: Optional[str] = "payalfoundation@ybl"
    upi_qr_url: Optional[str] = None
    order: int

    class Config:
        from_attributes = True

class TrusteeCreate(BaseModel):
    name: str
    role: str
    role_mr: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = "1234567890"
    upi_id: Optional[str] = "payalfoundation@ybl"
    upi_qr_url: Optional[str] = None
    order: Optional[int] = 0

class TrusteeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    role_mr: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    upi_id: Optional[str] = None
    upi_qr_url: Optional[str] = None
    order: Optional[int] = None

# Initiative
class InitiativeSchema(BaseModel):
    id: int
    title: str
    title_mr: Optional[str] = None
    description: str
    description_mr: Optional[str] = None
    category: str
    icon: str
    image_url: Optional[str] = None
    target_amount: float
    raised_amount: float

    class Config:
        from_attributes = True

class InitiativeCreate(BaseModel):
    title: str
    title_mr: Optional[str] = None
    description: str
    description_mr: Optional[str] = None
    category: str = "Social Welfare"
    icon: Optional[str] = "Heart"
    image_url: Optional[str] = None
    target_amount: float = 0.0
    raised_amount: float = 0.0

class InitiativeUpdate(BaseModel):
    title: Optional[str] = None
    title_mr: Optional[str] = None
    description: Optional[str] = None
    description_mr: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    target_amount: Optional[float] = None
    raised_amount: Optional[float] = None

# Contact Message
class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Volunteer
class VolunteerCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    city: str = "Mumbai"
    interest_area: str = "Community Welfare"
    skills: Optional[str] = None
    message: Optional[str] = None

class VolunteerResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    city: str
    interest_area: str
    skills: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Donation
class DonationCreate(BaseModel):
    donor_name: str
    donor_phone: str
    donor_email: Optional[str] = None
    donor_pan: Optional[str] = None
    amount: float
    payment_method: str = "UPI"
    transaction_ref: Optional[str] = None
    cause: Optional[str] = "General Community Fund"

class DonationResponse(BaseModel):
    id: int
    donor_name: str
    donor_phone: str
    donor_email: Optional[str] = None
    donor_pan: Optional[str] = None
    amount: float
    payment_method: str
    transaction_ref: Optional[str] = None
    cause: Optional[str]
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Admin Login
class AdminLoginRequest(BaseModel):
    password: str

# Home Stats
class HomeStatsSchema(BaseModel):
    id: Optional[int] = 1
    stat1_number: str = "100%"
    stat1_label: str = "Community Dedicated"
    stat1_label_mr: Optional[str] = "समाजास समर्पित"

    stat2_number: str = "50+"
    stat2_label: str = "Active Social Workers"
    stat2_label_mr: Optional[str] = "सक्रिय समाजसेवक"

    stat3_number: str = "10,000+"
    stat3_label: str = "Families Impacted"
    stat3_label_mr: Optional[str] = "मदत पोहचलेली कुटुंबे"

    class Config:
        from_attributes = True

class HomeStatsUpdateSchema(BaseModel):
    stat1_number: Optional[str] = None
    stat1_label: Optional[str] = None
    stat1_label_mr: Optional[str] = None

    stat2_number: Optional[str] = None
    stat2_label: Optional[str] = None
    stat2_label_mr: Optional[str] = None

    stat3_number: Optional[str] = None
    stat3_label: Optional[str] = None
    stat3_label_mr: Optional[str] = None

# Gallery Item
class GalleryItemSchema(BaseModel):
    id: int
    image_url: str
    title: str
    title_mr: Optional[str] = None
    category: str = "Social Service"
    category_mr: Optional[str] = None
    order: int = 0

    class Config:
        from_attributes = True

class GalleryItemCreate(BaseModel):
    image_url: str
    title: Optional[str] = "Gallery Photo"
    title_mr: Optional[str] = None
    category: Optional[str] = "Social Service"
    category_mr: Optional[str] = None
    order: Optional[int] = 0

class GalleryItemUpdate(BaseModel):
    image_url: Optional[str] = None
    title: Optional[str] = None
    title_mr: Optional[str] = None
    category: Optional[str] = None
    category_mr: Optional[str] = None
    order: Optional[int] = None
