from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Profile
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.utils import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from datetime import datetime, timedelta
from app.services.forgot_password_service import generate_reset_token, verify_and_reset
from app.utils.email import send_reset_email
from app.utils.signupemail import send_verify_email
from app.services.verify_signup_email import generate_otp
from app.schemas.user import ResetPasswordRequest
from app.schemas.user import ForgotPasswordRequest
from fastapi import Request
from app.schemas.user import OTPVerify
from app.models.user import PendingUser
from app.schemas.user import ResendOTPRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate OTP and store in PendingUser
    otp = generate_otp()
    pending_user = PendingUser(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        otp=otp
    )
    
    # Use merge or handle existing pending entry to avoid UniqueConstraint errors
    db.merge(pending_user)
    db.commit()
    
    # Send the email
    send_verify_email(user_data.email, otp) # Ensure your email service accepts the OTP
    
    return {"message": "Verification code sent to your email."}


@router.post("/verify-signup-otp")
def verify_signup_otp(request: OTPVerify, db: Session = Depends(get_db)):
    # Match the model definition exactly
    pending = db.query(PendingUser).filter(
        PendingUser.email == request.email,
        PendingUser.otp == request.otp # Changed from otp_code to otp
    ).first()

    # 2. Validation checks
    if not pending:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    if datetime.utcnow() > pending.expires_at:
        db.delete(pending)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP expired")

    # 3. Create actual User and Profile (Atomic Transaction)
    try:
        new_user = User(
            email=pending.email,
            hashed_password=pending.hashed_password,
            full_name=pending.full_name
        )
        db.add(new_user)
        db.flush() # Flush to get new_user.id
        
        new_profile = Profile(user_id=new_user.id, name=new_user.full_name)
        db.add(new_profile)
        
        # 4. Remove pending record
        db.delete(pending)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration failed")

    return {"message": "User verified successfully. Please login."}

@router.post("/resend-signup-otp")
def resend_signup_otp(request: ResendOTPRequest, db: Session = Depends(get_db)):

    pending = db.query(PendingUser).filter(PendingUser.email == request.email).first()

    if not pending:
        raise HTTPException(status_code=404, detail="No pending signup for this email")

    new_otp = generate_otp()
    pending.otp = new_otp
    pending.expires_at = datetime.utcnow() + timedelta(minutes=5)

    db.commit()

    try:
        send_verify_email(pending.email, new_otp)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "New verification code sent"}
    
@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Finding User
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Creating access Token
    
    access_token = create_access_token(
        data = {"sub": str(user.id)},
        expires_delta=timedelta(minutes=60)
    )
    
    return{
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="No account with this email"
        )

    otp_code = generate_reset_token(user, db)

    try:
        send_reset_email(user.email, otp_code)
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send email"
        )

    return {"message": "OTP sent"}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 1. Check if the new password is the same as the current one
    if verify_password(request.new_password, user.hashed_password):
        raise HTTPException(
            status_code=400, 
            detail="New password cannot be the same as your old password."
        )
    # 2. Update password and clear reset tokens
    user.hashed_password = get_password_hash(request.new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    
    db.commit()
    return {"message": "Password updated successfully"}

@router.post("/resend-otp")
def resend_otp(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account with this email")
    
    new_otp = generate_reset_token(user, db)
    
    try:
        send_reset_email(user.email, new_otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "New OTP sent to your email"}

@router.post("/verify-otp")
def verify_otp(request: OTPVerify, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == request.email).first()

    if not user or str(user.reset_password_token).strip() != str(request.otp).strip():
        raise HTTPException(status_code=400, detail="Invalid OTP code")
        
    return {"message": "OTP Verified"}