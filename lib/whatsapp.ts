interface WhatsAppOptions {
  message: string;
  to: string;
}

export async function sendWhatsAppToNumber({ message, to }: WhatsAppOptions) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!to || !accountSid || !authToken || !twilioPhone) {
      console.warn(`⚠️ Twilio credentials not set. Simulated WhatsApp to ${to}:`);
      console.warn(`[WhatsApp Message]: ${message}`);
      return true; // Simulate success
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const data = new URLSearchParams();
    data.append("To", to);
    data.append("From", twilioPhone);
    data.append("Body", message);

    const authPrefix = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authPrefix}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Twilio WhatsApp Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}

export async function sendAdminWhatsAppMessage({ message }: { message: string }) {
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;
  if (!adminPhone) {
    console.warn("⚠️ Admin Phone missing.");
    return true; // Simulate success if admin phone not set
  }
  return sendWhatsAppToNumber({ message, to: adminPhone });
}
