const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD, // Corrected to match .env variable name
  },
});

// Generate verification token
const generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECERET, {
    expiresIn: "1d",
  });
};

// Send verification email
const sendVerificationEmail = async (user, baseUrl) => {
  try {
    // Use existing token
    const verificationToken = user.verificationToken;

    // Create verification URL
    const verificationUrl = `${baseUrl}/api/auth/verify/${verificationToken}`;

    const message = {
      from: `Event Booking <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Email Verification",
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (user, event) => {
  const message = {
    from: `Event Booking <${process.env.EMAIL}>`,
    to: user.email,
    subject: `Booking Confirmation: ${event.title}`,
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for booking "${event.title}"</p>
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p>We look forward to seeing you there!</p>
    `,
  };
  try {
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

module.exports = {
  generateVerificationToken,
  sendBookingConfirmation,
  sendVerificationEmail,
};
