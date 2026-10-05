from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from .database import Base

class TrustInfo(Base):
    __tablename__ = "trust_info"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), default="Payal Foundation and Social Service")
    tagline = Column(String(255), default="Empowering Communities, Serving Humanity")
    tagline_mr = Column(String(255), default="सक्षम समाज, समृद्ध भविष्य आणि मानवतेची सेवा")
    reg_no = Column(String(100), default="G.B.B.S.D 409/2026 | F-82401 (M)")
    act_name = Column(String(255), default="Public Trust Act, Govt. of Maharashtra")
    president = Column(String(255), default="Zakir Hussain")
    secretary = Column(String(255), default="Mohd Rahim Abdul Kalam Khan")
    phone = Column(String(50), default="+91 77768 76121")
    email = Column(String(100), default="contact@payalfoundation.org")
    address = Column(Text, default="Gala No D 1, Aana Sagar Scrap Market, Kurla-Andheri Road, Near Naaz Hotel, Jarimari, Sakinaka, Mumbai - 400072")
    bank_name = Column(String(100), default="State Bank of India")
    bank_account_no = Column(String(50), default="428901238910")
    bank_ifsc = Column(String(20), default="SBIN0001234")
    upi_id = Column(String(100), default="payalfoundation@ybl")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Trustee(Base):
    __tablename__ = "trustees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False)
    role_mr = Column(String(100), nullable=True)
    photo_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0)

class Initiative(Base):
    __tablename__ = "initiatives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_mr = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    description_mr = Column(Text, nullable=True)
    category = Column(String(100), default="Social Welfare")
    icon = Column(String(50), default="Heart")
    image_url = Column(String(500), nullable=True)
    target_amount = Column(Float, default=0.0)
    raised_amount = Column(Float, default=0.0)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="New")
    created_at = Column(DateTime, default=datetime.utcnow)

class VolunteerApplication(Base):
    __tablename__ = "volunteer_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(100), nullable=True)
    city = Column(String(100), default="Mumbai")
    interest_area = Column(String(100), default="Community Welfare")
    skills = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_name = Column(String(255), nullable=False)
    donor_phone = Column(String(50), nullable=False)
    donor_email = Column(String(100), nullable=True)
    donor_pan = Column(String(20), nullable=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="UPI")
    transaction_ref = Column(String(100), nullable=True)
    cause = Column(String(100), default="General Community Fund")
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class HomeStat(Base):
    __tablename__ = "home_stats"

    id = Column(Integer, primary_key=True, index=True)
    stat1_number = Column(String(50), default="100%")
    stat1_label = Column(String(100), default="Community Dedicated")
    stat1_label_mr = Column(String(100), default="समाजास समर्पित")

    stat2_number = Column(String(50), default="50+")
    stat2_label = Column(String(100), default="Active Social Workers")
    stat2_label_mr = Column(String(100), default="सक्रिय समाजसेवक")

    stat3_number = Column(String(50), default="10,000+")
    stat3_label = Column(String(100), default="Families Impacted")
    stat3_label_mr = Column(String(100), default="मदत पोहचलेली कुटुंबे")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
