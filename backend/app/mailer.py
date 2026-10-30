import smtplib
import logging
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.parse
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
    clean_name = (name or "N/A").strip()
    clean_phone = (phone or "N/A").strip()
    clean_phone_digits = "".join([c for c in clean_phone if c.isdigit()])
    clean_phone_for_tel = "".join([c for c in clean_phone if c.isdigit() or c == '+'])
    clean_phone2 = phone2.strip() if phone2 and phone2.strip() else ""

    # Combine address
    addr_parts = []
    if address and address.strip() and address.strip() != "दिलेला नाही":
        addr_parts.append(address.strip())
    if taluka and taluka.strip() and taluka.strip() != "दिलेला नाही":
        addr_parts.append(taluka.strip())
    if district and district.strip() and district.strip() != "दिलेला नाही":
        addr_parts.append(district.strip())
    full_address_str = ", ".join(addr_parts) if addr_parts else "दिलेला नाही"

    now_str = datetime.now().strftime("%d-%m-%Y %I:%M %p")

    # WhatsApp link
    wa_number = f"91{clean_phone_digits}" if len(clean_phone_digits) == 10 else clean_phone_digits
    wa_text = urllib.parse.quote(f"नमस्कार {clean_name}, पायल फाउंडेशन, पालघरकडून संपर्क करत आहोत.")
    whatsapp_url = f"https://wa.me/{wa_number}?text={wa_text}"

    subject = f"🔔 नवीन संपर्क संदेश: {clean_name} ({clean_phone}) - Payal Foundation"

    # Plain text version
    text_content = f"""
नवीन संपर्क संदेश - पायल फाउंडेशन आणि सोशल सर्व्हिस
==================================================
नाव (Name): {clean_name}
फोन नंबर: {clean_phone}
{f'फोन २: {clean_phone2}' if clean_phone2 else ''}
पत्ता (Address): {full_address_str}
तारीख व वेळ: {now_str}

संदेश (Message):
{message}

वेबसाइट: Payal Foundation and Social Service
"""

    formatted_msg = (message or "N/A").replace("\n", "<br>")

    # Rich HTML Email Version matching user's Image 2
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
    
    <!-- Top Header -->
    <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); color: #ffffff; padding: 24px 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 21px; font-weight: 800; letter-spacing: 0.3px;">पायल फाउंडेशन आणि सोशल सर्व्हिस</h2>
      <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">नवीन चौकशी व संपर्क संदेश (Website Inquiry Alert)</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 24px 22px; background: #ffffff;">
      <div style="display: inline-block; background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 9999px; margin-bottom: 16px;">
        🔔 New Website Message
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 145px;">
            👤 नाव (Name)
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;">
            {clean_name}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
            📞 फोन नंबर
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #2563eb; font-weight: 700;">
            <a href="tel:{clean_phone_for_tel}" style="color: #2563eb; text-decoration: none;">{clean_phone}</a>
          </td>
        </tr>
        {f'''<tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
            📱 फोन २
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #334155; font-weight: 600;">
            <a href="tel:{clean_phone2}" style="color: #2563eb; text-decoration: none;">{clean_phone2}</a>
          </td>
        </tr>''' if clean_phone2 else ''}
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
            📍 पत्ता (Address)
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
            {full_address_str}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
            ⏰ तारीख व वेळ
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;">
            {now_str}
          </td>
        </tr>
      </table>

      <div style="font-weight: 700; font-size: 13px; color: #64748b; margin: 16px 0 8px 0;">
        📝 पाठवलेला संदेश:
      </div>
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
        {formatted_msg}
      </div>

      <!-- Action Buttons -->
      <div style="text-align: center; margin: 24px 0 10px 0;">
        <a href="tel:{clean_phone_for_tel}" style="display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 11px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px; margin: 4px 6px; box-shadow: 0 4px 10px rgba(37,99,235,0.25);">
          📞 थेट कॉल करा
        </a>
        <a href="{whatsapp_url}" style="display: inline-block; background: #22c55e; color: #ffffff !important; text-decoration: none; padding: 11px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px; margin: 4px 6px; box-shadow: 0 4px 10px rgba(34,197,94,0.25);">
          💬 WhatsApp रिप्लाय द्या
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
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
        # Try SSL first (Port 465)
        server = smtplib.SMTP_SSL(SMTP_HOST, 465, timeout=12)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, recipient_list, msg.as_string())
        server.quit()
        logger.info(f"Contact email alert sent successfully to {recipient_list}")
        return {"sent": True, "status": "delivered", "to": recipient_list}
    except Exception as ssl_err:
        logger.warning(f"SMTP_SSL failed, trying TLS on port 587: {ssl_err}")
        try:
            server = smtplib.SMTP(SMTP_HOST, 587, timeout=12)
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, recipient_list, msg.as_string())
            server.quit()
            logger.info(f"Contact email alert sent via TLS to {recipient_list}")
            return {"sent": True, "status": "delivered", "to": recipient_list}
        except Exception as err:
            logger.error(f"Failed to send contact email alert: {err}")
            return {"sent": False, "status": "error", "error": str(err)}
