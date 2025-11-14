# Production Deployment Guide - HOH 108

This guide covers deploying the HOH 108 application (Frontend + Backend) to production.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [CORS Configuration](#cors-configuration)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Admin Credentials](#admin-credentials)
6. [Database Setup](#database-setup)

---

## ✅ Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or MongoDB server)
- Domain name (for production)
- SSL certificate (recommended)

---

## 🔒 CORS Configuration

### Current Status
✅ **CORS has been configured and fixed**

### Configuration Details

The backend now supports environment-based CORS configuration:

**Development Mode:**
- Accepts requests from: `http://localhost:5173`, `http://localhost:3000`
- Allows all origins during development

**Production Mode:**
- Only accepts requests from whitelisted domains
- Configure via `CORS_ORIGIN` in `.env`

### How to Update CORS for Production

Edit `/Users/lincolnkushwah/Desktop/HOH-tech/HOH108_BE/.env`:

```env
# Replace with your production domain(s)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Multiple domains can be separated by commas.

---

## 🚀 Backend Deployment

### 1. Environment Setup

**File:** `HOH108_BE/.env`

```env
# Server Configuration
NODE_ENV=production
PORT=8000

# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hoh108

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# JWT Configuration (IMPORTANT: Change this!)
JWT_SECRET=your-production-random-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

**⚠️ Important Security Notes:**
- Change `JWT_SECRET` to a strong random string (minimum 32 characters)
- Never commit `.env` to version control
- Use `.env.production.example` as template

### 2. Install Dependencies

```bash
cd /Users/lincolnkushwah/Desktop/HOH-tech/HOH108_BE
npm install --production
```

### 3. Seed Admin Users (First Time Only)

```bash
# Create admin accounts for all verticals
node backend/seedAllAdmins.js

# Seed on-demand services (if needed)
node backend/seedOnDemandServices.js
```

### 4. Start Production Server

**Option A: Direct Node**
```bash
NODE_ENV=production node backend/server.js
```

**Option B: PM2 (Recommended)**
```bash
npm install -g pm2
pm2 start backend/server.js --name "hoh108-api"
pm2 startup
pm2 save
```

### 5. Server Verification

Test the server:
```bash
curl http://your-server-ip:8000/health
```

Expected response:
```json
{
  "success": true,
  "message": "HOH 108 API is running",
  "timestamp": "2025-11-14T..."
}
```

---

## 🌐 Frontend Deployment

### 1. Update Production Environment

**File:** `HOH108_FE/.env.production`

```env
# Production Environment
VITE_API_URL=https://api.yourdomain.com
```

Or if backend is on same domain:
```env
VITE_API_URL=https://yourdomain.com:8000
```

### 2. Build for Production

✅ **Production build completed!**

Location: `/Users/lincolnkushwah/Desktop/HOH-tech/HOH108_FE/dist/`

To rebuild:
```bash
cd /Users/lincolnkushwah/Desktop/HOH-tech/HOH108_FE
npm run build
```

Build output:
- `dist/` folder contains all production files
- Total size: ~1.4 MB (332 KB gzipped)
- Optimized and minified

### 3. Deployment Options

**Option A: Static Hosting (Netlify/Vercel)**
1. Upload `dist/` folder
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

**Option B: Traditional Server (Nginx)**

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/hoh108/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Option C: Same Server as Backend**

The backend can serve the frontend static files. Add to `server.js`:
```javascript
// Serve frontend static files
app.use(express.static(path.join(__dirname, '../HOH108_FE/dist')));

// Catch all routes and serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../HOH108_FE/dist/index.html'));
});
```

---

## 👥 Admin Credentials

### Super Admin (All Verticals)
- **Email:** `superadmin@hoh108.com`
- **Password:** `admin123`
- **Access:** Full access to all verticals

### Interior Admin
- **Email:** `interior@hoh108.com`
- **Password:** `interior123`
- **Access:** Interior vertical only

### Construction Admin
- **Email:** `construction@hoh108.com`
- **Password:** `construction123`
- **Access:** Construction vertical only

### Renovation Admin
- **Email:** `renovation@hoh108.com`
- **Password:** `renovation123`
- **Access:** Renovation vertical only

### On-Demand Admin
- **Email:** `ondemand@hoh108.com`
- **Password:** `ondemand123`
- **Access:** On-demand services only

**⚠️ IMPORTANT:** Change all passwords after first login!

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

Current connection string:
```
mongodb+srv://hoh108:1234qwer@cluster0.h24ruhi.mongodb.net/hoh108
```

**Security Steps:**
1. Change MongoDB password
2. Whitelist only your server IP
3. Enable encryption at rest
4. Set up automated backups

### Collections Created
- `users` - Admin and customer accounts
- `ondemandservices` - Service catalog (8 services seeded)
- `ondemandbookings` - Customer bookings
- `serviceproviders` - Service provider profiles

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint
```bash
curl https://api.yourdomain.com/health
```

### View Logs (PM2)
```bash
pm2 logs hoh108-api
pm2 monit
```

### Database Monitoring
- Use MongoDB Atlas dashboard
- Set up alerts for high memory/CPU usage
- Configure automated backups

---

## 🚨 Troubleshooting

### CORS Errors
**Issue:** "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env`
2. Ensure frontend domain is whitelisted
3. Verify `NODE_ENV=production` is set
4. Restart backend server

### API Connection Failed
**Issue:** Frontend can't connect to backend

**Solution:**
1. Check `VITE_API_URL` in frontend `.env.production`
2. Verify backend is running: `curl http://your-server:8000/health`
3. Check firewall rules on server
4. Verify SSL certificates (if using HTTPS)

### Login Issues
**Issue:** "401 Unauthorized" on login

**Solution:**
1. Verify admin users exist: `node backend/checkAdminUsers.js`
2. Re-seed if needed: `node backend/seedAllAdmins.js`
3. Check MongoDB connection
4. Verify JWT_SECRET is set correctly

---

## 📁 File Structure

```
HOH-tech/
├── HOH108_BE/                    # Backend
│   ├── backend/
│   │   ├── server.js            # Main server file
│   │   ├── models/              # MongoDB models
│   │   ├── controllers/         # Business logic
│   │   ├── routes/              # API routes
│   │   ├── seedAllAdmins.js     # Admin user seeder
│   │   └── seedOnDemandServices.js  # Services seeder
│   ├── .env                     # Environment config
│   ├── .env.production.example  # Production template
│   └── package.json
│
└── HOH108_FE/                    # Frontend
    ├── dist/                    # ✅ Production build
    ├── src/
    ├── .env                     # Development config
    ├── .env.production          # Production config
    └── package.json
```

---

## ✅ Deployment Checklist

### Backend
- [ ] Update `.env` with production values
- [ ] Change `JWT_SECRET` to random string
- [ ] Update `CORS_ORIGIN` with production domains
- [ ] Seed admin users
- [ ] Seed on-demand services
- [ ] Start server with PM2
- [ ] Verify health check endpoint
- [ ] Test API endpoints

### Frontend
- [ ] Update `.env.production` with API URL
- [ ] Run production build
- [ ] Upload `dist/` to hosting
- [ ] Configure domain and SSL
- [ ] Test frontend loads
- [ ] Test API connectivity
- [ ] Test admin login

### Security
- [ ] Change all admin passwords
- [ ] Update MongoDB password
- [ ] Whitelist server IP in MongoDB
- [ ] Enable SSL/HTTPS
- [ ] Set up firewall rules
- [ ] Enable automated backups

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review server logs: `pm2 logs`
- Check MongoDB Atlas logs
- Verify all environment variables are set correctly

---

**Last Updated:** November 14, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
