import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, phone2, address, taluka, district, message } = req.body || {};

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'payalfoundation212@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'vyjoprzupvvrwuns'
      }
    });

    const cleanName = (name || 'N/A').trim();
    const cleanPhone = (phone || 'N/A').trim();
    const cleanPhoneForTel = cleanPhone.replace(/[^0-9+]/g, '');
    const cleanPhone2 = phone2 && phone2.trim() ? phone2.trim() : '';

    // Combine address parts neatly: Address, Taluka, District
    const addressParts = [];
    if (address && address.trim() && address.trim() !== 'दिलेला नाही') addressParts.push(address.trim());
    if (taluka && taluka.trim() && taluka.trim() !== 'दिलेला नाही') addressParts.push(taluka.trim());
    if (district && district.trim() && district.trim() !== 'दिलेला नाही') addressParts.push(district.trim());
    const fullAddressStr = addressParts.length > 0 ? addressParts.join(', ') : 'दिलेला नाही';

    // Format current date and time in IST (e.g. 22-10-2026 09:26 AM)
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const day = String(istTime.getUTCDate()).padStart(2, '0');
    const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
    const year = istTime.getUTCFullYear();
    let hours = istTime.getUTCHours();
    const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
    const dateTimeStr = `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;

    // Clean Phone for WhatsApp link
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    const waNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
    const whatsappLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`नमस्कार ${cleanName}, पायल फाउंडेशन, पालघरकडून संपर्क करत आहोत.`)}`;

    const formattedMessage = (message || 'N/A').replace(/\n/g, '<br>');

    const mailOptions = {
      from: '"Payal Foundation Website" <payalfoundation212@gmail.com>',
      to: 'payalfoundation212@gmail.com',
      subject: `🔔 नवीन संपर्क संदेश: ${cleanName} (${cleanPhone}) - Payal Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b;">
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
                    ${cleanName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
                    📞 फोन नंबर
                  </td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #2563eb; font-weight: 700;">
                    <a href="tel:${cleanPhoneForTel}" style="color: #2563eb; text-decoration: none;">${cleanPhone}</a>
                  </td>
                </tr>
                ${cleanPhone2 ? `
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
                    📱 फोन २
                  </td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #334155; font-weight: 600;">
                    <a href="tel:${cleanPhone2.replace(/[^0-9+]/g, '')}" style="color: #2563eb; text-decoration: none;">${cleanPhone2}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
                    📍 पत्ता (Address)
                  </td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
                    ${fullAddressStr}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">
                    ⏰ तारीख व वेळ
                  </td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;">
                    ${dateTimeStr}
                  </td>
                </tr>
              </table>

              <div style="font-weight: 700; font-size: 13px; color: #64748b; margin: 16px 0 8px 0;">
                📝 पाठवलेला संदेश:
              </div>
              <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
                ${formattedMessage}
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 24px 0 10px 0;">
                <a href="tel:${cleanPhoneForTel}" style="display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 11px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px; margin: 4px 6px; box-shadow: 0 4px 10px rgba(37,99,235,0.25);">
                  📞 थेट कॉल करा
                </a>
                <a href="${whatsappLink}" style="display: inline-block; background: #22c55e; color: #ffffff !important; text-decoration: none; padding: 11px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px; margin: 4px 6px; box-shadow: 0 4px 10px rgba(34,197,94,0.25);">
                  💬 WhatsApp रिप्लाय द्या
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Payal Foundation and Social Service &bull; Palghar &bull; Registered Trust
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
