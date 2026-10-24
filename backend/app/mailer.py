import smtplib
import logging
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, NOTIFY_EMAIL

logger = logging.getLogger(__name__)

def send_contact_email_notification(
    name: str,
    phone: str,
    phone2: str = "",
    address: str = "",
    taluka: str = "",
    district: str = "",
    message: str = ""
) -> dict:
    """
    Sends an immediate HTML + Plain text email alert to payalfoundation212@gmail.com
    when someone fills out the contact form on Payal Foundation website.
    Includes: Name, Phone 1, Phone 2, Address, Taluka, District, Message.
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
    clean_phone2 = phone2.strip() if phone2 and phone2.strip() else "दिलेला नाही (Not provided)"
    clean_address = address.strip() if address and address.strip() else "दिलेला नाही (Not provided)"
    clean_taluka = taluka.strip() if taluka and taluka.strip() else "दिलेला नाही (Not provided)"
    clean_district = district.strip() if district and district.strip() else "दिलेला नाही (Not provided)"
    now_str = datetime.now().strftime("%d-%m-%Y %I:%M %p")

    subject = f"🔔 नवीन संपर्क संदेश: {name} ({phone}) - Payal Foundation"

    # Plain text version
    text_content = f"""
नवीन संपर्क संदेश - पायल फाउंडेशन आणि सोशल सर्व्हिस
==================================================
नाव (Name): {name}
फोन नंबर १ (Phone 1): {phone}
फोन नंबर २ (Phone 2): {clean_phone2}
पत्ता (Address): {clean_address}
तालुका (Taluka): {clean_taluka}
जिल्हा (District): {clean_district}

संदेश (Message):
{message}

तारीख व वेळ: {now_str}
वेबसाइट: Payal Foundation and Social Service
"""

    # Format Phone 2 HTML and call button
    if phone2 and phone2.strip():
        phone2_digits = phone2.replace("+", "").replace(" ", "").strip()
        phone2_html = f'<a href="tel:{phone2.strip()}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{phone2.strip()}</a>'
        phone2_btn = f'<a href="tel:{phone2.strip()}" class="btn" style="background: #0284c7;">📱 फोन २ वर कॉल करा</a>'
    else:
        phone2_html = '<span style="color: #94a3b8; font-style: italic;">दिलेला नाही (Not provided)</span>'
        phone2_btn = ''

    phone1_digits = phone.replace("+", "").replace(" ", "").strip()

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
    .info-table .label {{ font-weight: bold; width: 32%; color: #64748b; background: #f8fafc; }}
    .info-table .value {{ font-weight: 600; color: #0f172a; }}
    .message-box {{ background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 25px; }}
    .btn-row {{ text-align: center; margin-top: 15px; }}
    .btn {{ display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 25px; font-weight: bold; font-size: 13px; margin: 0 4px 10px 4px; }}
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
          <td class="label">📞 फोन नंबर १</td>
          <td class="value"><a href="tel:{phone}" style="color: #2563eb; text-decoration: none;">{phone}</a></td>
        </tr>
        <tr>
          <td class="label">📱 फोन नंबर २</td>
          <td class="value">{phone2_html}</td>
        </tr>
        <tr>
          <td class="label">📍 पत्ता (Address)</td>
          <td class="value">{clean_address}</td>
        </tr>
        <tr>
          <td class="label">🏛️ तालुका (Taluka)</td>
          <td class="value">{clean_taluka}</td>
        </tr>
        <tr>
          <td class="label">🌍 जिल्हा (District)</td>
          <td class="value">{clean_district}</td>
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
        <a href="tel:{phone}" class="btn">📞 फोन १ वर कॉल करा</a>
        <a href="https://wa.me/91{phone1_digits}" class="btn btn-whatsapp">💬 WhatsApp वर बोला</a>
        {phone2_btn}
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

    # Try sending: Primary attempt via SSL (465), fallback to STARTTLS (587)
    errors = []
    
    # 1. Try SMTPS (SSL)
    try:
        server = smtplib.SMTP_SSL(SMTP_HOST, 465, timeout=12)
        with server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, recipient_list, msg.as_string())
            logger.info(f"Successfully dispatched contact notification email via SSL (465) to {recipient_list}")
            return {"sent": True, "status": "delivered", "recipients": recipient_list, "method": "SSL_465"}
    except Exception as e_ssl:
        logger.warning(f"SSL (465) attempt failed ({e_ssl}). Trying fallback to TLS (587)...")
        errors.append(f"SSL: {e_ssl}")

    # 2. Try STARTTLS (587)
    try:
        server = smtplib.SMTP(SMTP_HOST, 587, timeout=12)
        with server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, recipient_list, msg.as_string())
            logger.info(f"Successfully dispatched contact notification email via STARTTLS (587) to {recipient_list}")
            return {"sent": True, "status": "delivered", "recipients": recipient_list, "method": "STARTTLS_587"}
    except Exception as e_tls:
        logger.error(f"STARTTLS (587) attempt failed: {e_tls}")
        errors.append(f"TLS: {e_tls}")

    return {"sent": False, "status": "error", "error": "; ".join(errors)}
