const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const MAIL_CLIENT_ID = process.env.MAIL_CLIENT_ID;
const MAIL_CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
// Note: Refresh token is usually required for persistent OAuth2 access. 
// If not provided, this service might require manual authentication or a different method.
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN; 

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    let transporter;

    if (MAIL_CLIENT_ID && MAIL_CLIENT_SECRET && REFRESH_TOKEN) {
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        MAIL_CLIENT_ID,
        MAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) reject("Failed to create access token :(");
          resolve(token);
        });
      });

      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: ADMIN_EMAIL,
          accessToken,
          clientId: MAIL_CLIENT_ID,
          clientSecret: MAIL_CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN
        }
      });
    } else {
      // Fallback or simpler method (e.g. App Password if configured)
      // For now, we log that configuration is incomplete if refresh token is missing
      console.warn("Email service configuration incomplete. Refresh token missing.");
      return;
    }

    const mailOptions = {
      from: `MediBook <${ADMIN_EMAIL}>`,
      to,
      subject,
      text,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email Send Error:', error);
    throw error;
  }
};

const sendAppointmentEmail = async (appointment, type) => {
  const { doctor, patient, date, time } = appointment;
  const subject = type === 'booked' ? 'New Appointment Booked' : `Appointment ${type}`;
  
  const text = `
    Hello ${patient.name},
    Your appointment with Dr. ${doctor.name} on ${new Date(date).toLocaleDateString()} at ${time} has been ${type}.
    Thank you for choosing MediBook.
  `.trim();

  await sendEmail({ to: patient.email, subject, text });
};

const sendApprovalEmail = async (doctor) => {
  const subject = 'Your MediBook Profile is Approved!';
  const text = `
    Hello Dr. ${doctor.name},
    Congratulations! Your profile has been approved by the administrator. 
    You are now visible to patients on the MediBook platform.
  `.trim();

  await sendEmail({ to: doctor.email, subject, text });
};

module.exports = { sendEmail, sendAppointmentEmail, sendApprovalEmail };
