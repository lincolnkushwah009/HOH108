# Environment Configuration Guide

## Quick Start

The application can be easily switched between **Development** and **Production** environments using a single configuration file.

## How to Switch Environments

### Location
The environment configuration is located at:
```
src/config/environment.js
```

### Switching Between Environments

Open `src/config/environment.js` and change the `ENV` constant:

#### For Development (Local Testing)
```javascript
const ENV = 'development';
```
- API URL: `http://localhost:5000`
- Debug mode: Enabled
- Logging: Enabled

#### For Production (Server Deployment)
```javascript
const ENV = 'production';
```
- API URL: Your production server URL (must be configured)
- Debug mode: Disabled
- Logging: Disabled

### Setting Up Production URL

Before deploying to production:

1. Open `src/config/environment.js`
2. Find the production configuration section:
```javascript
production: {
  API_URL: 'http://YOUR_SERVER_IP_OR_DOMAIN:5000',
  // ...
}
```
3. Replace `YOUR_SERVER_IP_OR_DOMAIN` with your actual server address:
   - Example with IP: `http://203.0.113.45:5000`
   - Example with domain: `https://api.yourdomain.com`
   - Example with custom port: `http://api.yourdomain.com:8000`

### After Changing Environment

**IMPORTANT**: After changing the environment configuration, you must rebuild the application:

```bash
# For development
npm run dev

# For production build
npm run build
```

## Environment Variables

The configuration includes:

| Variable | Development | Production |
|----------|-------------|------------|
| `API_URL` | http://localhost:5000 | Your server URL |
| `APP_NAME` | HOH 108 (Dev) | HOH 108 |
| `DEBUG` | true | false |
| `ENABLE_LOGGING` | true | false |

## Usage in Code

You can import and use the config anywhere in your application:

```javascript
import { config, devLog, errorLog } from '@/config/environment';

// Check current environment
if (config.isDevelopment) {
  console.log('Running in development mode');
}

// Use dev logging (only logs in development)
devLog('This only shows in development');

// Error logging (always shows)
errorLog('This always shows');

// Access API URL
console.log(config.API_URL);
```

## Deployment Checklist

Before deploying to production:

- [ ] Change `ENV` to `'production'` in `src/config/environment.js`
- [ ] Update production `API_URL` with your server address
- [ ] Run `npm run build` to create production build
- [ ] Test the production build locally if possible
- [ ] Deploy the `dist` folder to your hosting service

## Troubleshooting

### Network Error / Cannot Connect to Server

1. Check that `ENV` is set correctly in `environment.js`
2. Verify the `API_URL` matches your server address
3. Ensure the backend server is running
4. Check CORS settings on the backend
5. Rebuild the frontend after changing configuration

### Still Using Old URL

- Clear browser cache
- Stop and restart the development server
- Rebuild the application with `npm run build`
