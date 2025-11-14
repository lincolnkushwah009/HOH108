const nodemailer = require('nodemailer');

/**
 * Email Service for sending notifications
 * Configure with SendGrid, Resend, or Gmail
 */

// Create transporter
const createTransporter = () => {
  // For development: Use Gmail or Ethereal (fake SMTP)
  // For production: Use SendGrid, Resend, or AWS SES

  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    // SendGrid configuration
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'resend') {
    // Resend configuration
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'gmail') {
    // Gmail configuration (for testing)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password
      }
    });
  } else {
    // Default: Console log only (no actual email sent)
    console.warn('⚠️  Email service not configured. Emails will be logged to console only.');
    return null;
  }
};

// Email templates
const emailTemplates = {
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmed - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; }
          .button { display: inline-block; background: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Thank you for choosing our service</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>Your booking has been successfully confirmed. Here are your booking details:</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${booking.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${booking.service.title}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Scheduled Date:</span>
                <span class="detail-value">${new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time Slot:</span>
                <span class="detail-value">${booking.timeSlot.start} - ${booking.timeSlot.end}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">₹${booking.pricing.total.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service Address:</span>
                <span class="detail-value">${booking.serviceAddress.addressLine1}, ${booking.serviceAddress.city}</span>
              </div>
            </div>

            <p><strong>What's Next?</strong></p>
            <ul>
              <li>We'll assign a service provider shortly</li>
              <li>You'll receive updates via email</li>
              <li>The provider will contact you before arrival</li>
            </ul>

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-booking?bookingId=${booking.bookingId}&phone=${booking.customer.phone}" class="button">
                Track Your Booking
              </a>
            </center>

            <p>If you have any questions, feel free to contact us at <strong>${process.env.SUPPORT_EMAIL || 'support@hoh108.com'}</strong> or call <strong>+91 123 456 7890</strong>.</p>

            <div class="footer">
              <p>Thank you for choosing HOH108!</p>
              <p>&copy; ${new Date().getFullYear()} HOH108. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  providerAssigned: (booking) => ({
    subject: `Service Provider Assigned - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .provider-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👨‍🔧 Service Provider Assigned!</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>Great news! A service provider has been assigned to your booking <strong>${booking.bookingId}</strong>.</p>

            <div class="provider-card">
              <h3>Service Provider Details:</h3>
              <p><strong>Name:</strong> ${booking.serviceProvider.fullName}</p>
              <p><strong>Phone:</strong> ${booking.serviceProvider.phone}</p>
              ${booking.serviceProvider.rating ? `<p><strong>Rating:</strong> ⭐ ${booking.serviceProvider.rating.average.toFixed(1)}/5.0</p>` : ''}
              <p><strong>Experience:</strong> ${booking.serviceProvider.experience?.years || 'N/A'} years</p>
            </div>

            <p><strong>Scheduled Details:</strong></p>
            <ul>
              <li>Date: ${new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
              <li>Time: ${booking.timeSlot.start} - ${booking.timeSlot.end}</li>
              <li>Service: ${booking.service.title}</li>
            </ul>

            <p>The provider will contact you shortly to confirm the appointment.</p>

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-booking?bookingId=${booking.bookingId}&phone=${booking.customer.phone}" class="button">
                Track Your Booking
              </a>
            </center>

            <div class="footer">
              <p>Thank you for choosing HOH108!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  statusUpdate: (booking, statusMessage) => ({
    subject: `Booking Status Update - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Status Update</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>Your booking <strong>${booking.bookingId}</strong> has been updated.</p>

            <p><strong>Current Status:</strong></p>
            <div class="status-badge" style="background: #dcfce7; color: #166534;">
              ${statusMessage}
            </div>

            <p><strong>Service:</strong> ${booking.service.title}</p>
            <p><strong>Scheduled:</strong> ${new Date(booking.scheduledDate).toLocaleDateString('en-IN')} at ${booking.timeSlot.start}</p>

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-booking?bookingId=${booking.bookingId}&phone=${booking.customer.phone}" class="button">
                View Details
              </a>
            </center>

            <div class="footer">
              <p>Thank you for choosing HOH108!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  bookingCompleted: (booking) => ({
    subject: `Service Completed - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Service Completed!</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>Your service for booking <strong>${booking.bookingId}</strong> has been completed successfully!</p>

            <p>We hope you're satisfied with the service. Your feedback helps us improve.</p>

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile/projects" class="button">
                Rate Your Experience
              </a>
            </center>

            <p><strong>Booking Summary:</strong></p>
            <ul>
              <li>Service: ${booking.service.title}</li>
              <li>Provider: ${booking.serviceProvider?.fullName || 'N/A'}</li>
              <li>Total Paid: ₹${booking.pricing.total.toFixed(2)}</li>
            </ul>

            <p>Thank you for choosing HOH108. We look forward to serving you again!</p>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} HOH108. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, template) => {
  const transporter = createTransporter();

  if (!transporter) {
    // Log to console if no email service configured
    console.log('\n📧 ===== EMAIL NOTIFICATION =====');
    console.log('To:', to);
    console.log('Subject:', template.subject);
    console.log('================================\n');
    return { success: true, message: 'Email logged (no service configured)' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"HOH108" <${process.env.EMAIL_FROM || 'noreply@hoh108.com'}>`,
      to: to,
      subject: template.subject,
      html: template.html
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Export email service functions
module.exports = {
  sendBookingConfirmation: async (booking) => {
    const template = emailTemplates.bookingConfirmation(booking);
    return await sendEmail(booking.customer.email, template);
  },

  sendProviderAssigned: async (booking) => {
    const template = emailTemplates.providerAssigned(booking);
    return await sendEmail(booking.customer.email, template);
  },

  sendStatusUpdate: async (booking, statusMessage) => {
    const template = emailTemplates.statusUpdate(booking, statusMessage);
    return await sendEmail(booking.customer.email, template);
  },

  sendBookingCompleted: async (booking) => {
    const template = emailTemplates.bookingCompleted(booking);
    return await sendEmail(booking.customer.email, template);
  }
};
