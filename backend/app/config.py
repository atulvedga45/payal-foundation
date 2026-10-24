import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/samajseva")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "sonya-payal@palghar@1741")
CORS_ORIGINS = [
    origin.strip() 
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")
    if origin.strip()
]

# Fast2SMS Configuration for 9225243552 & 8766573113
FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY", "").strip()
SMS_NOTIFY_NUMBERS = os.getenv("SMS_NOTIFY_NUMBERS", "9225243552,8766573113").strip()

# Email Notification Configuration (Gmail SMTP)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "payalfoundation212@gmail.com").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", "payalfoundation212@gmail.com").strip()


