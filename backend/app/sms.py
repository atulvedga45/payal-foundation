import json
import logging
import urllib.request
import urllib.error
from .config import FAST2SMS_API_KEY, SMS_NOTIFY_NUMBERS

logger = logging.getLogger(__name__)

def send_contact_sms_notification(name: str, phone: str, address: str = "", message: str = "") -> dict:
    """
    Sends an SMS alert via Fast2SMS to the designated trustee / volunteer numbers:
    7776876121 and 8766573113.
    """
    if not FAST2SMS_API_KEY:
        logger.warning(
            "FAST2SMS_API_KEY is not set in backend/.env. SMS dispatch skipped. "
            "To send automatic SMS to 7776876121 & 8766573113, please obtain a free key from fast2sms.com "
            "and add FAST2SMS_API_KEY=your_key in backend/.env."
        )
        return {
            "sent": False,
            "status": "pending_api_key",
            "message": "FAST2SMS_API_KEY not configured in backend/.env"
        }

    # Clean and format address and message
    addr_text = address.strip() if address else "Not provided"
    
    # Construct concise SMS alert text
    sms_text = (
        f"Payal Foundation Alert:\n"
        f"Name: {name}\n"
        f"Phone: {phone}\n"
        f"Address: {addr_text}\n"
        f"Msg: {message}"
    )

    # Fast2SMS Quick SMS character limit handling
    if len(sms_text) > 300:
        sms_text = sms_text[:297] + "..."

    url = "https://www.fast2sms.com/dev/bulkV2"
    payload = {
        "route": "q",
        "message": sms_text,
        "language": "english",
        "flash": 0,
        "numbers": SMS_NOTIFY_NUMBERS
    }

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "authorization": FAST2SMS_API_KEY,
                "Content-Type": "application/json"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_content = response.read().decode("utf-8")
            logger.info(f"Fast2SMS API Response: {res_content}")
            return {
                "sent": True,
                "status": "delivered",
                "response": json.loads(res_content) if res_content else {}
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8") if e.fp else str(e)
        logger.error(f"Fast2SMS HTTP Error [{e.code}]: {err_msg}")
        return {"sent": False, "status": "error", "message": f"HTTP {e.code}: {err_msg}"}
    except Exception as e:
        logger.error(f"Failed to send SMS via Fast2SMS: {e}")
        return {"sent": False, "status": "error", "message": str(e)}
