const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard gmail setup
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('[MAILER] !!! SMTP Connection Error:', error);
  } else {
    console.log('[MAILER] SMTP Server is ready to take our messages');
  }
});

const sendOTPToEmail = async (email, otp) => {
  // Check if credentials are set, else just log to console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[MAILER] !!! WARNING: SMTP credentials NOT found in .env file !!!`);
    console.log(`[MAILER] SIMULATION ONLY: Your OTP for ${email} is: ${otp}`);
    console.log(`[MAILER] This OTP is ONLY visible in this terminal. To send real emails, fix your .env file.`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Office Management System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Login OTP',
      text: `Your One-Time Password is: ${otp}\n\nThis code will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Office Management System</h2>
          <p>Your One-Time Password to login is:</p>
          <h1 style="color: #4f8ef7; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    });
    console.log(`Email sent to ${email}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
const sendEnrollmentToAdmin = async (userData) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'gshiven10@gmail.com';
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[MAILER] SIMULATION: Enrollment notification for ${userData.email} logged.`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Office Management System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: 'New User Enrollment Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4f8ef7;">New Enrollment Application</h2>
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Phone:</strong> ${userData.phone}</p>
          <hr/>
          <h3>Work Details:</h3>
          <p><strong>Experience:</strong> ${userData.experience}</p>
          <p><strong>Expertise:</strong> ${userData.expertise}</p>
          <p><strong>Reason for leaving last job:</strong> ${userData.quit_reason}</p>
          <p>Please log in to the admin panel to approve or reject this applicant.</p>
        </div>
      `
    });
    console.log(`Enrollment email sent to admin: ${adminEmail}`);
  } catch (err) {
    console.error("Error sending enrollment email:", err);
  }
};

module.exports = { sendOTPToEmail, sendEnrollmentToAdmin };
