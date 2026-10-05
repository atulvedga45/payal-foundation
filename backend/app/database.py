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

def get_engine_and_session():
    global engine, SessionLocal
    if engine is not None and SessionLocal is not None:
        return engine, SessionLocal

    # Try PostgreSQL or configured URL
    try:
        test_engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Verify connection
        with test_engine.connect() as conn:
            pass
        logger.info(f"Successfully connected to Database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
        engine = test_engine
    except Exception as e:
        logger.warning(f"Could not connect to configured DATABASE_URL ({e}). Falling back to SQLite for local persistence.")
        sqlite_url = "sqlite:///./samajseva.db"
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        logger.info(f"Connected to fallback SQLite Database: {sqlite_url}")

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, SessionLocal

engine, SessionLocal = get_engine_and_session()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
