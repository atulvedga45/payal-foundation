import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import DATABASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

# Attempt to connect to configured DATABASE_URL (e.g. PostgreSQL)
engine = None
SessionLocal = None

import os

def get_engine_and_session():
    global engine, SessionLocal
    if engine is not None and SessionLocal is not None:
        return engine, SessionLocal

    db_url = DATABASE_URL or ""
    # Normalize postgres:// to postgresql:// required by SQLAlchemy
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    # Try PostgreSQL or configured URL
    if db_url and "postgres" in db_url and "localhost" not in db_url:
        try:
            connect_args = {"connect_timeout": 15}
            test_engine = create_engine(db_url, pool_pre_ping=True, pool_recycle=300, connect_args=connect_args)
            with test_engine.connect() as conn:
                pass
            logger.info(f"Successfully connected to PostgreSQL Database: {db_url.split('@')[-1]}")
            engine = test_engine
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            return engine, SessionLocal
        except Exception as e:
            logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to SQLite.")

    # SQLite fallback (check for persistent mounted directory if available)
    uploads_dir = os.getenv("UPLOADS_PATH", "")
    if uploads_dir and os.path.exists(uploads_dir):
        sqlite_path = os.path.join(uploads_dir, "samajseva.db")
    else:
        sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "samajseva.db"))

    sqlite_url = f"sqlite:///{sqlite_path}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    logger.info(f"Connected to SQLite Database: {sqlite_url}")

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, SessionLocal

engine, SessionLocal = get_engine_and_session()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
