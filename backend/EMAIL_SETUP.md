# Email Notification Setup Guide

## Overview
Email notifications are automatically sent to customers for:
- ✅ Booking Confirmation
- ✅ Service Provider Assigned
- ✅ Status Updates
- ✅ Booking Completed

## Current Status
✅ Email service implemented
✅ Beautiful HTML email templates created
✅ Integrated with booking system
⚠️ **Email service needs configuration** (currently logs to console only)

---

## Option 1: Console Logging (Current - No Setup Required)
**Status**: Active by default
**Cost**: FREE
**What happens**: Emails are logged to console instead of being sent

Perfect for **development and testing**. No configuration needed!

---

## Option 2: SendGrid (Recommended for Production)
**Free Tier**: 100 emails/day forever
**Cost**: $0 for 100 emails/day, then $0.10 per 1,000 emails

### Setup Steps:
1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env`:
   ```
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   FRONTEND_URL=http://localhost:5173
   SUPPORT_EMAIL=support@yourdomain.com
   ```

---

## Option 3: Resend (Modern & Clean)
**Free Tier**: 3,000 emails/month
**Cost**: $20/month for 50,000 emails

### Setup Steps:
1. Sign up at https://resend.com
2. Get API key
3. Add to `.env`:
   ```
   EMAIL_SERVICE=resend
   RESEND_API_KEY=your_resend_api_key_here
   EMAIL_FROM=onboarding@resend.dev
   FRONTEND_URL=http://localhost:5173
   SUPPORT_EMAIL=support@yourdomain.com
   ```

---

## Option 4: Gmail (Testing Only)
**Free Tier**: Limited
**Not recommended for production**

### Setup Steps:
1. Create a Gmail account
2. Enable 2FA
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Add to `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   EMAIL_FROM=your-email@gmail.com
   FRONTEND_URL=http://localhost:5173
   SUPPORT_EMAIL=support@yourdomain.com
   ```

---

## Environment Variables Reference

Add these to your `/backend/.env` file:

```env
# Email Configuration
EMAIL_SERVICE=sendgrid              # or 'resend', 'gmail', or leave empty for console
SENDGRID_API_KEY=                   # SendGrid API key (if using SendGrid)
RESEND_API_KEY=                     # Resend API key (if using Resend)
EMAIL_USER=                         # Gmail email (if using Gmail)
EMAIL_PASSWORD=                     # Gmail app password (if using Gmail)
EMAIL_FROM=noreply@hoh108.com       # Sender email address
FRONTEND_URL=http://localhost:5173  # Your frontend URL (for tracking links)
SUPPORT_EMAIL=support@hoh108.com    # Support contact email
```

---

## Email Templates Included

### 1. Booking Confirmation
- Sent immediately after booking creation
- Includes: Booking ID, service details, schedule, amount, address
- Has "Track Your Booking" button

### 2. Provider Assigned
- Sent when admin assigns a service provider
- Includes: Provider name, phone, rating, experience
- Scheduled date/time details

### 3. Status Update
- Sent when booking status changes
- Shows current status with color coding
- Quick "View Details" link

### 4. Booking Completed
- Sent when service is marked complete
- Includes summary and "Rate Your Experience" button
- Thank you message

---

## Testing Email Service

### Test Without Configuration (Console Logs)
1. Create a booking
2. Check backend console logs
3. You'll see email content printed

### Test With Email Service
1. Configure email service (SendGrid/Resend/Gmail)
2. Create a booking
3. Check your email inbox
4. Check backend logs for success/error messages

---

## How It Works

```javascript
// Email is sent asynchronously (doesn't block request)
emailService.sendBookingConfirmation(booking)
  .then(() => console.log('✅ Email sent'))
  .catch(err => console.error('❌ Email failed:', err));
```

**Benefits:**
- Non-blocking: User gets instant response
- Error handling: Failures don't break booking flow
- Logging: All email activity logged for debugging

---

## Production Recommendations

### ✅ Best Practices:
1. **Use SendGrid or Resend** (not Gmail)
2. **Set up domain email** (e.g., support@yourdomain.com)
3. **Configure DMARC/SPF/DKIM** (improves deliverability)
4. **Monitor email logs** regularly
5. **Add unsubscribe link** (for transactional emails optional, but good practice)

### ⚠️ Important:
- Never commit `.env` file to git
- Keep API keys secure
- Test emails before going live
- Monitor free tier limits

---

## Troubleshooting

### Emails not sending?
1. Check `.env` file has correct values
2. Check backend console for errors
3. Verify EMAIL_SERVICE variable is set
4. Check API key is valid
5. Ensure email service account is active

### Emails going to spam?
1. Set up SPF/DKIM records
2. Use verified sender domain
3. Avoid spam trigger words
4. Warm up your sending domain gradually

---

## Future Enhancements (Optional)

- [ ] SMS notifications (using Twilio/MSG91)
- [ ] WhatsApp notifications (Business API)
- [ ] Push notifications (FCM)
- [ ] In-app notification center
- [ ] Email templates customization panel
- [ ] Scheduled email campaigns

---

## Support

Need help setting up emails?
- Check SendGrid/Resend documentation
- Test with console logs first
- Monitor backend logs for errors
- Contact support if issues persist

---

**Current Implementation Status**: ✅ READY TO USE
**Configuration Required**: ⚠️ YES (for production)
**Development Mode**: ✅ Works out of the box (console logs)
