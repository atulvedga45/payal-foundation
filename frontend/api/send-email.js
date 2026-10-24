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

    const cleanPhone2 = phone2 && phone2.trim() ? phone2.trim() : 'दिलेला नाही';
    const cleanAddress = address && address.trim() ? address.trim() : 'दिलेला नाही';
    const cleanTaluka = taluka && taluka.trim() ? taluka.trim() : 'दिलेला नाही';
    const cleanDistrict = district && district.trim() ? district.trim() : 'दिलेला नाही';

    const mailOptions = {
      from: '"Payal Foundation Website" <payalfoundation212@gmail.com>',
      to: 'payalfoundation212@gmail.com',
      subject: `🔔 नवीन संपर्क संदेश: ${name || 'N/A'} (${phone || 'N/A'}) - Payal Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%); color: #ffffff; padding: 22px 24px;">
            <h2 style="margin: 0; font-size: 20px;">🔔 नवीन संपर्क संदेश (New Contact Message)</h2>
            <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">पायल फाउंडेशन अँड सोशल सर्विस, पालघर</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 140px;">नाव (Name):</td><td style="color: #0f172a; font-weight: 700;">${name || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">फोन १ (Phone 1):</td><td><a href="tel:${phone}" style="color: #0284c7; font-weight: 700; text-decoration: none;">${phone || 'N/A'}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">फोन २ (Phone 2):</td><td style="color: #334155;">${cleanPhone2}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">पत्ता (Address):</td><td style="color: #334155;">${cleanAddress}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">तालुका (Taluka):</td><td style="color: #334155;">${cleanTaluka}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">जिल्हा (District):</td><td style="color: #334155;">${cleanDistrict}</td></tr>
            </table>
            <div style="margin-top: 18px; padding: 16px; background: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px;">
              <strong style="color: #0f172a; display: block; margin-bottom: 8px; font-size: 15px;">संदेश (Message):</strong>
              <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message || 'N/A'}</p>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 12px; color: #64748b;">
            Payal Foundation and Social Service &bull; Palghar &bull; Registered Trust
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
