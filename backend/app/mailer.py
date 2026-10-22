import smtplib
import logging
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, NOTIFY_EMAIL

logger = logging.getLogger(__name__)

def send_contact_email_notification(name: str, phone: str, address: str = "", message: str = "") -> dict:
    """
    Sends an immediate HTML + Plain text email alert to payalfoundation212@gmail.com
    when someone fills out the contact form on Payal Foundation website.
    """
    if not SMTP_PASSWORD:
        logger.warning(
            "SMTP_PASSWORD is not set in backend/.env. Email not sent. "
            f"Add SMTP_PASSWORD (Google App Password) to send email alerts to {NOTIFY_EMAIL}."
        )
        return {
            "sent": False,
            "status": "pending_app_password",
            "message": "SMTP_PASSWORD (16-digit Google App Password) missing in backend/.env"
        }

    recipient_list = [e.strip() for e in (NOTIFY_EMAIL or "payalfoundation212@gmail.com").split(",") if e.strip()]
    clean_address = address.strip() if address else "पत्ता दिलेला नाही (Not provided)"
    now_str = datetime.now().strftime("%d-%m-%Y %I:%M %p")

    subject = f"🔔 नवीन संपर्क संदेश: {name} ({phone}) - Payal Foundation"

    # Plain text version
    text_content = f"""
नवीन संपर्क संदेश - पायल फाउंडेशन आणि सोशल सर्व्हिस
==================================================
नाव: {name}
फोन नंबर: {phone}
पत्ता: {clean_address}
संदेश:
{message}

तारीख व वेळ: {now_str}
वेबसाइट: Payal Foundation and Social Service
"""

    # Rich HTML Email Version
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }}
    .email-container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
    .email-header {{ background: linear-gradient(135deg, #1e40af, #2563eb); color: #ffffff; padding: 25px 20px; text-align: center; }}
    .email-header h1 {{ margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }}
    .email-header p {{ margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }}
    .email-body {{ padding: 25px 20px; }}
    .badge {{ display: inline-block; background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px; margin-bottom: 15px; }}
    .info-table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
    .info-table td {{ padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }}
    .info-table .label {{ font-weight: bold; width: 30%; color: #64748b; background: #f8fafc; }}
    .info-table .value {{ font-weight: 600; color: #0f172a; }}
    .message-box {{ background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 25px; }}
    .btn-row {{ text-align: center; margin-top: 15px; }}
    .btn {{ display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 10px 22px; border-radius: 25px; font-weight: bold; font-size: 14px; margin: 0 5px 10px 5px; }}
    .btn-whatsapp {{ background: #25D366; }}
    .email-footer {{ background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>पायल फाउंडेशन आणि सोशल सर्व्हिस</h1>
      <p>नवीन चौकशी व संपर्क संदेश (Website Inquiry Alert)</p>
    </div>
    
    <div class="email-body">
      <div class="badge">🔔 New Website Message</div>
      
      <table class="info-table">
        <tr>
          <td class="label">👤 नाव (Name)</td>
          <td class="value">{name}</td>
        </tr>
        <tr>
          <td class="label">📞 फोन नंबर</td>
          <td class="value"><a href="tel:{phone}" style="color: #2563eb; text-decoration: none;">{phone}</a></td>
        </tr>
        <tr>
          <td class="label">📍 पत्ता (Address)</td>
          <td class="value">{clean_address}</td>
        </tr>
        <tr>
          <td class="label">⏰ तारीख व वेळ</td>
          <td class="value">{now_str}</td>
        </tr>
      </table>

      <div style="font-weight: bold; font-size: 13px; color: #64748b; margin-bottom: 6px;">📝 पाठवलेला संदेश:</div>
      <div class="message-box">
        {message.replace(chr(10), '<br>')}
      </div>

      <div class="btn-row">
        <a href="tel:{phone}" class="btn">📞 थेट कॉल करा</a>
        <a href="https://wa.me/91{phone.replace('+', '').replace(' ', '')}" class="btn btn-whatsapp">💬 WhatsApp रिप्लाय द्या</a>
      </div>
    </div>

    <div class="email-footer">
      Payal Foundation and Social Service &bull; Palghar &bull; Registered Trust
    </div>
  </div>
</body>
</html>
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Payal Foundation Website <{SMTP_USER}>"
    msg["To"] = ", ".join(recipient_list)

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        if SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=15)
        else:
            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15)
            server.starttls()

        with server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, recipient_list, msg.as_string())
            logger.info(f"Successfully dispatched contact notification email to {recipient_list}")
            return {"sent": True, "status": "delivered", "recipients": recipient_list}
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_list}: {e}")
        return {"sent": False, "status": "error", "error": str(e)}
