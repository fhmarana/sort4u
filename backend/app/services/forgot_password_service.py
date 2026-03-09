import secrets
from datetime import datetime, timedelta
from app.utils import get_password_hash 
import random

def generate_reset_token(user, db):
    token = secrets.token_urlsafe(32)
    user.reset_password_token = token
    user.reset_password_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()
    return token

def verify_and_reset(user, new_password, db):
    user.hashed_password = get_password_hash(new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    db.commit()


def generate_reset_token(user, db):
    otp = str(random.randint(100000, 999999))
    user.reset_password_token = otp
    user.reset_password_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()
    return otp