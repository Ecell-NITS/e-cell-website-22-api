const Brevo = require("@getbrevo/brevo");
require("dotenv").config();

if (!process.env.BREVO_API_KEY || !process.env.BREVO_EMAIL) {
  throw new Error("Brevo credentials are missing in environment variables");
}

// Initialize Brevo client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

/**
 * Send an email using Brevo's transactional API.
 * @param {string|string[]} to - Recipient email address or array of email addresses
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content
 * @returns {Promise<boolean>} - Returns true if email sent successfully
 */
const sendEmail = async (to, subject, text, html = "") => {
  try {
    // Handle both single email and array of emails
    const recipients = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];

    const sendSmtpEmail = {
      sender: { name: "ECELL NIT Silchar", email: process.env.BREVO_EMAIL },
      to: recipients,
      subject,
      textContent: text,
      htmlContent: html || text,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", response.body.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error?.response?.body || error);
    return false;
  }
};

module.exports = {
  sendEmail,
};
