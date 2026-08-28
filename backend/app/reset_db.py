import os
import sys
from .database import engine, Base, SessionLocal
from .seed_data import seed_database

if __name__ == "__main__":
    print("Resetting database with clean UTF-8 verified crop records...")
    seed_database(force_reseed=True)
    print("Database reset complete.")
