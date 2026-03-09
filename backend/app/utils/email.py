import smtplib
from email.message import EmailMessage

def send_reset_email(user_email: str, otp_code: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 465
    sender_email = "sort4uu@gmail.com"
    sender_password = "lydz kuzd acra fbsl".replace(" ", "")

    msg = EmailMessage()
    msg['Subject'] = 'Password Reset Request'
    msg['From'] = sender_email
    msg['To'] = user_email

    # The content now uses the otp_code passed into the function
    msg.set_content(f"""
You requested a password reset.

Your verification code is: {otp_code}

This code will expire in 15 minutes.
""")

    with smtplib.SMTP_SSL(smtp_server, smtp_port) as smtp:
        smtp.login(sender_email, sender_password)
        smtp.send_message(msg)