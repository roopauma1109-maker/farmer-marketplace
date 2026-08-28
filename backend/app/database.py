import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agridirect.database")

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:root@localhost:3306/agridirect")
FALLBACK_SQLITE_URL = "sqlite:///./agridirect.db"

def get_engine():
    """
    Creates the SQLAlchemy engine. Tries connecting to MySQL (and creates database if needed).
    Falls back gracefully to SQLite if MySQL is unreachable.
    """
    if DATABASE_URL.startswith("mysql"):
        try:
            # First attempt to ensure the database exists in MySQL
            import pymysql
            from urllib.parse import urlparse
            
            # Clean protocol prefix for parsing
            clean_url = DATABASE_URL.replace("mysql+pymysql://", "mysql://")
            parsed = urlparse(clean_url)
            
            db_name = parsed.path.lstrip("/") or "agridirect"
            user = parsed.username or "root"
            password = parsed.password or ""
            host = parsed.hostname or "localhost"
            port = parsed.port or 3306

            try:
                conn = pymysql.connect(
                    host=host,
                    user=user,
                    password=password,
                    port=port
                )
                with conn.cursor() as cursor:
                    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
                conn.close()
                logger.info(f"Successfully ensured MySQL database '{db_name}' exists.")
            except Exception as e:
                logger.warning(f"Could not automatically create MySQL database '{db_name}': {e}")

            # Create MySQL engine
            engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=3600,
                echo=False
            )
            # Test connection
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Connected to MySQL database successfully.")
            return engine
        except Exception as e:
            logger.warning(f"MySQL connection to '{DATABASE_URL}' failed: {e}. Falling back to SQLite for seamless execution.")
            return create_engine(
                FALLBACK_SQLITE_URL,
                connect_args={"check_same_thread": False},
                echo=False
            )
    else:
        # SQLite or other engine
        return create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
            echo=False
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    FastAPI dependency that provides a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
